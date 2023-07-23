#include <cs50.h>
#include <stdio.h>

int main(void)
{
    // Prompt for start size
    int start_size, end_size, years = 0;
    do
    {
        start_size = get_int("Enter starting size: ");
    }
    while (start_size < 9);

    // Prompt for end size
    do
    {
        end_size = get_int("Enter end size: ");
    }
    while (end_size < start_size);

    // Calculate number of years until we reach threshold
    if (start_size == end_size)
    {
        printf("Years: %i\n", years);
    }
    else
    {
        do
        {
            start_size = start_size + start_size / 3 - start_size / 4;
            years++;
        }
        while (start_size < end_size);

        // Print number of years
        printf("Years: %i\n", years);
    }
}