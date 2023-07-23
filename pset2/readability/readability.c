#include <cs50.h>
#include <stdio.h>
#include <string.h>
#include <math.h>
#include <ctype.h>

int main(void)
{
    int letters = 0, words = 1, sentences = 0, grade;
    char c;
    // get a string from the user
    string the_text = get_string("Text: ");
    for (int i = 0, n = strlen(the_text); i < n; i++)
    {
        c = the_text[i];
        // if c is a letter add one to letter count
        if (isalpha(c))
        {
            letters++;
        }
        // if c is a space add one to words count
        if (isspace(c))
        {
            words++;
        }
        // if the sentence ends with . or ! or ? add one to sentences count
        if (c == '.' || c == '!'  || c == '?')
        {
            sentences++;
        }
    }

    // get average grade using: index = 0.0588 * L - 0.296 * S - 15.8
    // where L is the average number of letters per 100 words in the
    // text, and S is the average number of sentences per 100 words
    // in the text.
    grade = round(0.0588 * (letters * 100.0 / words) - 0.296 * (sentences * 100.0 / words) - 15.8);

    // print out grade level
    if (grade < 1)
    {
        printf("Before Grade 1\n");
    }
    else if (grade >= 16)
    {
        printf("Grade 16+\n");
    }
    else
    {
        printf("Grade %i\n", grade);
    }

}