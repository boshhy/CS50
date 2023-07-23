// Implements a dictionary's functionality

#include <stdbool.h>
#include <stdio.h>  // added
#include <string.h> // added
#include <stdlib.h> // added
#include <strings.h> // added
#include <ctype.h> // added

#include "dictionary.h"

// Represents a node in a hash table
typedef struct node
{
    char word[LENGTH + 1];
    struct node *next;
}
node;

// Number of buckets in hash table
const unsigned int N = 2048;

// Hash table
node *table[N];

// added this to keep track of the number of word
// inserted into the table
int size_of_table = 0;

// Returns true if word is in dictionary, else false
bool check(const char *word)
{
    // creates a temporary word arry to hold word
    char tmp_word[LENGTH + 1];
    // loop through the word and put lowercase into
    // temporary array
    for (int i = 0, n = strlen(word); i <= n; i++)
    {
        tmp_word[i] = tolower(word[i]);
    }
    int index = hash(tmp_word);
    // point to the node of that perticular
    // array index according to hash function above
    node *tmp = table[index];
    // loop through link list of nodes for that index
    while (tmp != NULL)
    {
        // if word is found then return
        // else if word is not found go to the next node
        if (strcasecmp(tmp->word, tmp_word) == 0)
        {
            return true;
        }
        else
        {
            tmp = tmp->next;
        }
    }
    // case where word was not found then return false
    return false;
}

// Hashes word to a number
unsigned int hash(const char *word)
{
    // setting index to 0
    int index = 0;
    // for every loop go through the word and add up that character to index
    // then multiply the index by each by the character and module N to get a
    // valid index of out table array
    for (int i = 0, n = strlen(word); i < n; i++)
    {
        index += word[i];
        index = (index * word[i]) % N;
    }
    return index;
}

bool insert_new_word(node *new_node)
{
    // if node being inserted is NULL then return false
    if (new_node == NULL)
    {
        return false;
    }
    // add one to table_size
    // get the index of the table where word should be
    size_of_table++;
    int index = hash(new_node->word);
    // set the new node to point to head of link list
    new_node->next = table[index];
    // make the head of the link list the new node that was just added
    table[index] = new_node;
    return true;
}

// Loads dictionary into memory, returning true if successful, else false
bool load(const char *dictionary)
{
    // set every index of table to NULL
    for (int i = 0; i < N; i++)
    {
        table[i] = NULL;
    }
    // make an array to be assigned a new word that is being
    // read from the dictioinary file.
    // open the dictionary and assign file to point to address of dictionary file
    char current_word[LENGTH + 1];
    FILE *file = fopen(dictionary, "r");
    // if dictionary could not be open retun false
    if (file == NULL)
    {
        return false;
    }
    // go through each word and store into current_word array
    while (fscanf(file, "%s", current_word) == 1)
    {
        // make a new node for a new word from dictionary
        node *n = malloc(sizeof(node));
        // if node could not be made then return false
        if (n == NULL)
        {
            return false;
        }
        // copy the current_word into n->word
        strcpy(n->word, current_word);
        // insert new node with newly added word to table
        insert_new_word(n);
    }
    fclose(file);
    return true;
}

// Returns number of words in dictionary if loaded, else 0 if not yet loaded
unsigned int size(void)
{
    return size_of_table;
}

// Unloads dictionary from memory, returning true if successful, else false
bool unload(void)
{
    // create 2 pointer to keep track of head and next nodes of array
    node *current;
    node *next;
    // go through all indexes of the table array
    for (int i = 0; i < N; i++)
    {
        // point to head of link list of particular index
        current = table[i];
        next = table[i];
        // do this if while we havent found the end of link list
        while (next != NULL)
        {
            // set next pointer to the next node in the link list
            // now that we have that address we can delete the head node
            next = current->next;
            free(current);
            // set the current poniter to the 'new' head node aka next pointer
            current = next;
        }
    }
    return true;
}
