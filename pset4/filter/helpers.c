#include "helpers.h"
#include <math.h>

// Convert image to grayscale
void grayscale(int height, int width, RGBTRIPLE image[height][width])
{
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            // add red, gree, and blue of each pixal and divide 3 three (this number
            // is going to be set to red, blue, and green channels)
            BYTE gray = round((image[i][j].rgbtRed + image[i][j].rgbtGreen + image[i][j].rgbtBlue) / 3.0);
            image[i][j].rgbtRed = gray;
            image[i][j].rgbtBlue = gray;
            image[i][j].rgbtGreen = gray;
        }
    }
    return;
}

// Reflect image horizontally
void reflect(int height, int width, RGBTRIPLE image[height][width])
{
    // make a temp RGBTRIPLE for swaping purposes
    // we only need to go to the middle of the image anything
    // past that we result in a reflected image being set back to normal
    RGBTRIPLE temp;
    int middle = width / 2;
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < middle; j++)
        {
            // swap the current pixal with corresponding
            // pixal of same row and swap them
            temp = image[i][j];
            image[i][j] = image[i][width - j - 1];
            image[i][width - j - 1] = temp;
        }
    }
    return;
}

// Blur image
void blur(int height, int width, RGBTRIPLE image[height][width])
{
    // making an RGBTRIPLE array of height+2 and width+2 to add extra edge
    // of pixals around the image of the copy
    int height_copy = height + 2;
    int width_copy = width + 2;
    RGBTRIPLE copy[height_copy][width_copy];
    for (int i = 0; i < height_copy; i++)
    {
        for (int j = 0; j < width_copy; j++)
        {
            // this if statement just makes sure there is a border around the copy
            // of the image
            if (i == 0 || i == height + 1 || j == 0 || j == width + 1)
            {
                copy[i][j].rgbtRed = 0;
                copy[i][j].rgbtGreen = 0;
                copy[i][j].rgbtBlue = 0;
            }
            else
            {
                copy[i][j] = image[i - 1][j - 1];
            }
        }
    }
    float red, green, blue;
    int n = 0;
    // loop through the copy starting at [1][1] because thats where the image
    // starts, and skip the border around edge
    for (int i = 1; i <= height; i++)
    {
        for (int j = 1; j <= width; j++)
        {
            red = 0;
            green = 0;
            blue = 0;
            n = 9;
            // fo each pixal loop through the surrounding pixals (original pixal
            // included) for a total of 9 pixals
            for (int k = -1; k < 2; k++)
            {
                for (int l = -1; l < 2; l++)
                {
                    red += copy[i + k][j + l].rgbtRed;
                    green += copy[i + k][j + l].rgbtGreen;
                    blue += copy[i + k][j + l].rgbtBlue;
                }
            }
            // if pixal is a corner piece then only divid by 4
            if ((i == 1 && j == 1) || (i == height && j == width) || (i == 1 && j == width) || (i == width && j == 1))
            {
                n = 4;
            }
            // if pixal is on edge then divide by 6
            else if (i == 1 || j == 1 || i == height || j == width)
            {
                n = 6;
            }
            // take the average of each color channel and put result
            // into ORIGINAL image
            image[i - 1][j - 1].rgbtRed = round(red / n);
            image[i - 1][j - 1].rgbtGreen = round(green / n);
            image[i - 1][j - 1].rgbtBlue = round(blue / n);
        }
    }
    return;
}

// Detect edges
void edges(int height, int width, RGBTRIPLE image[height][width])
{
    // make two 3x3 interger matrices to add the Gx and Gy values
    int gx[3][3] = {{-1, 0, 1}, {-2, 0, 2}, {-1, 0, 1}};
    int gy[3][3] = {{-1, -2, -1}, {0,  0, 0}, {1, 2, 1}};
    int height_copy = height + 2;
    int width_copy = width + 2;
    // making an array of RGBTRIPLES of size height+2 and width+2
    // to add our black border around copy
    RGBTRIPLE copy[height_copy][width_copy];
    for (int i = 0; i < height_copy; i++)
    {
        for (int j = 0; j < width_copy; j++)
        {
            // adding a black border to image copy
            if (i == 0 || i == height + 1 || j == 0 || j == width + 1)
            {
                copy[i][j].rgbtRed = 0;
                copy[i][j].rgbtGreen = 0;
                copy[i][j].rgbtBlue = 0;
            }
            else
            {
                copy[i][j] = image[i - 1][j - 1];
            }
        }
    }
    int red, green, blue, red2, green2, blue2;
    int n = 0;
    for (int i = 1; i <= height; i++)
    {
        for (int j = 1; j <= width; j++)
        {
            red = 0;
            green = 0;
            blue = 0;
            red2 = 0;
            green2 = 0;
            blue2 = 0;
            // loop through out gx and gy arrays and add each value
            // to thier corresponding color
            // note red is used for Gx and red2 is used for Gy. all other
            // color follow this same rule
            for (int k = 0; k < 3; k++)
            {
                for (int l = 0; l < 3; l++)
                {
                    red += copy[i + k - 1][j + l - 1].rgbtRed * gx[k][l];
                    green += copy[i + k - 1][j + l - 1].rgbtGreen * gx[k][l];
                    blue += copy[i + k - 1][j + l - 1].rgbtBlue * gx[k][l];

                    red2 += copy[i + k - 1][j + l - 1].rgbtRed * gy[k][l];
                    green2 += copy[i + k - 1][j + l - 1].rgbtGreen * gy[k][l];
                    blue2 += copy[i + k - 1][j + l - 1].rgbtBlue * gy[k][l];

                }
            }
            // multiplying our Gx values together then
            // multiplying our Gy values together then
            // adding them together and taking the square root
            // result will go back into red variable (no need to make another variable)
            red = round(sqrt(red * red + red2 * red2));
            green = round(sqrt(green * green + green2 * green2));
            blue = round(sqrt(blue * blue + blue2 * blue2));
            // if color value is greater than 255 then that pixal
            // should be set to 255
            // otherwise pixal will equal color value
            // repeat this for each color value
            if (red > 255)
            {
                image[i - 1][j - 1].rgbtRed = 255;
            }
            else
            {
                image[i - 1][j - 1].rgbtRed = red;
            }

            if (green > 255)
            {
                image[i - 1][j - 1].rgbtGreen = 255;
            }
            else
            {
                image[i - 1][j - 1].rgbtGreen = green;
            }

            if (blue > 255)
            {
                image[i - 1][j - 1].rgbtBlue = 255;
            }
            else
            {
                image[i - 1][j - 1].rgbtBlue = blue;
            }
        }
    }
    return;
}
