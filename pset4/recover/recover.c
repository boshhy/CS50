#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

int main(int argc, char *argv[])
{
    // making sure there is only 2 arguments
    // the program name and the memory to be recovered
    if (argc != 2)
    {
        printf("Usage: ./recover image\n");
        return 1;
    }

    // Open file as a read file
    FILE *card = fopen(argv[1], "r");

    // if card could not be opened or if it does not
    // exist return 1 and exit program
    if (card == NULL)
    {
        printf("Could not open file.\n");
        return 1;
    }

    // make a buffer of 512 unit8_t
    // each block is 512 BYTES in size and program needs enough
    // memory to hold one of these blocks
    uint8_t buffer[512];
    // open up a pointer to a file that will not be used yet until
    // we actually find at least 1 image
    FILE *image = fopen("trash", "w");
    int image_count = 0;
    // we need enough space to hold "XXX.jpg" which is 7 chars
    // plus the additional '\n' at the end of the string so total
    // of 8 char array
    char filename[8];
    // read one block from memory card into our buffer
    while (fread(buffer, sizeof(int8_t), 512, card))
    {
        // if we find that a block has these first 4 starging bits then, program has found a new image
        if (buffer[0] == 0xff && buffer[1] == 0xd8 && buffer[2] == 0xff && (buffer[3] & 0xf0) == 0xe0)
        {
            // close the previous image and incremeant name of file opened by 1
            // increment image_count by 1;
            fclose(image);
            sprintf(filename, "%03i.jpg", image_count);
            image_count++;
            image = fopen(filename, "w");
        }
        // this will only write once the program finds at least 1 image
        // after that if no new image has been found keep writeing to image file
        if (image_count > 0)
        {
            fwrite(buffer, sizeof(int8_t), 512, image);
        }
    }
    fclose(card);
    fclose(image);

}