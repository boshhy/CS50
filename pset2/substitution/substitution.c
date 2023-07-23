#include <cs50.h>
#include <stdio.h>
#include <ctype.h>
#include <string.h>

int main(int argc, string argv[])
{
    // command line arguments must contain a key
    if (argc != 2)
    {
        printf("Usage: ./substitution key\n");
        return 1;
    }

    // if key does not contain 26 chracterers -> terminate program with exit code 1
    if (strlen(argv[1]) != 26)
    {
        printf("Key must contain 26 characters.\n");
        return 1;
    }

    string encrypted_code = argv[1];

    for (int i = 0; i < 26; i++)
    {
        // if any character is a digit -> terminate with exit code 1
        if (isdigit(encrypted_code[i]))
        {
            printf("Key must not contain digits.\n");
            return 1;
        }
        for (int j = i + 1; j < 26; j++)
        {
            // if any duplicates are found -> terminate and terminate with exit code 1
            if (encrypted_code[i] == encrypted_code[j])
            {
                printf("Key must not contain duplicates.\n");
                return 1;
            }
        }
    }

    // get a word from the user to be encrypted
    string word_to_encrypt = get_string("Plaintext: ");
    char encrypted_word[strlen(word_to_encrypt)], c;

    // not we go to and include n to get the last char of '\0' into
    // our encrypted word so enctypted word will have '\0' as its last char
    for (int i = 0, n = strlen(word_to_encrypt); i <= n; i++)
    {
        // assign the next letter in the word to be encrypted
        c = word_to_encrypt[i];
        if (isupper(c))
        {
            // if the letter is uppercase then subtract 65 from it
            // to find coresponding encrypted letter
            encrypted_word[i] = toupper(encrypted_code[c - 65]);
        }
        else if (islower(c))
        {
            // if the letter is lower then subtract 97 from it
            // to find coresponding encrypted letter
            encrypted_word[i] = tolower(encrypted_code[c - 97]);
        }
        else
        {
            // if it's not a letter then dont do anyting and assign
            // it to encrypted word
            encrypted_word[i] = c;
        }
    }
    // print out the encrypted word
    printf("ciphertext: %s\n", encrypted_word);
}