#include <cs50.h>
#include <stdio.h>

int get_length(long);

int main(void)
{
    int cc_length = 0, digit, total = 0, first_digit;

    // prompt user for input
    long cc_number = get_long("Enter Credit Card Number: ");
    cc_length = get_length(cc_number);

    // check to see if its a valid length
    if (cc_length == 16 || cc_length == 15 || cc_length == 13)
    {
        // if length is valid take second to last number
        // and every other number, Multiply by 2 and add
        for (int i = 0; i < cc_length; i++)
        {
            // takes the first 2 digits and stores them in 'first_digit' variable
            if (i == cc_length - 2)
            {
                first_digit = cc_number;
            }
            digit = (cc_number % 10) * 2;
            cc_number = cc_number / 10;
            if (i % 2)
            {
                // if number is 10 or more split up and add individual integers
                if (digit > 9)
                {
                    total = total + (digit / 10) + (digit % 10);
                }
                // if total is 9 or less just add it to total
                else
                {
                    total = total + digit;
                }
            }
            else
            {
                // if total is not part of every other number divide by
                // 2 to undo our previous multiplication
                total = total + (digit / 2);
            }

        }

        // after total has been calculated check to see what card compnany it belongs to
        if (total % 10 != 0)
        {
            printf("INVALID\n");
            return 0;
        }
        // checks to see if American Express card
        if (first_digit == 34 || first_digit == 37)
        {
            printf("AMEX\n");
            return 0;
        }
        // checks to see if Mastercard card
        if (first_digit >= 51 && first_digit <= 55)
        {
            printf("MASTERCARD\n");
            return 0;
        }
        // check to see if Visa card
        if (first_digit / 10 == 4)
        {
            printf("VISA\n");
            return 0;
        }
        // if not any starting card numbers then it must be invalid
        printf("INVALID\n");
        return 0;
    }
    else
    {
        printf("INVALID\n");
        return 0;
    }

}

// returns the length of the input
int get_length(long n)
{
    int length = 0;
    while (n > 0)
    {
        n /= 10;
        length++;
    }
    return length;
}