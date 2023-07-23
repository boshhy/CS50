#include <cs50.h>
#include <stdio.h>

int main(void)
{
    int height, spaces, blocks;
    // promt user for pyramid height
    do
    {
        height = get_int("Enter height: ");
    }
    while (height < 1 || height > 8);
    blocks = height;
    do
    {
        spaces = height - 1;

        // print number of spaces
        for (int i = 0; i < spaces; i++)
        {
            printf(" ");
        }

        // print the number of blocks
        for (int i = spaces; i < blocks;  i++)
        {
            printf("#");
        }

        // print 2 spaces in between
        printf("  ");

        // print the same number of blocks again
        for (int i = spaces; i < blocks;  i++)
        {
            printf("#");
        }
        printf("\n");

        // go to the next line
        height--;
    }
    while (height > 0);
}