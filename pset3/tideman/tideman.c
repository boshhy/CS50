#include <cs50.h>
#include <stdio.h>
#include <string.h>

// Max number of candidates
#define MAX 9

// preferences[i][j] is number of voters who prefer i over j
int preferences[MAX][MAX];

// locked[i][j] means i is locked in over j
bool locked[MAX][MAX];

// Each pair has a winner, loser
typedef struct
{
    int winner;
    int loser;
}
pair;

// Array of candidates
string candidates[MAX];
pair pairs[MAX * (MAX - 1) / 2];

int pair_count;
int candidate_count;

// Function prototypes
bool vote(int rank, string name, int ranks[]);
void record_preferences(int ranks[]);
void add_pairs(void);
void sort_pairs(void);
void lock_pairs(void);
void print_winner(void);

int main(int argc, string argv[])
{
    // Check for invalid usage
    if (argc < 2)
    {
        printf("Usage: tideman [candidate ...]\n");
        return 1;
    }

    // Populate array of candidates
    candidate_count = argc - 1;
    if (candidate_count > MAX)
    {
        printf("Maximum number of candidates is %i\n", MAX);
        return 2;
    }
    for (int i = 0; i < candidate_count; i++)
    {
        candidates[i] = argv[i + 1];
    }

    // Clear graph of locked in pairs
    for (int i = 0; i < candidate_count; i++)
    {
        for (int j = 0; j < candidate_count; j++)
        {
            locked[i][j] = false;
        }
    }

    pair_count = 0;
    int voter_count = get_int("Number of voters: ");

    // Query for votes
    for (int i = 0; i < voter_count; i++)
    {
        // ranks[i] is voter's ith preference
        int ranks[candidate_count];

        // Query for each rank
        for (int j = 0; j < candidate_count; j++)
        {
            string name = get_string("Rank %i: ", j + 1);

            if (!vote(j, name, ranks))
            {
                printf("Invalid vote.\n");
                return 3;
            }
        }

        record_preferences(ranks);

        printf("\n");
    }

    add_pairs();
    sort_pairs();
    lock_pairs();
    print_winner();
    return 0;
}

// Update ranks given a new vote
bool vote(int rank, string name, int ranks[])
{
    // a name and rank comes in and is put into
    // the ranks array
    for (int i = 0; i < candidate_count; i++)
    {
        // only put the rank into ranks if
        // that name is a valid candidate
        if (strcmp(candidates[i], name) == 0)
        {
            ranks[rank] = i;
            return true;
        }
    }
    // if the candidate was not found
    // then return false
    return false;
}

// Update preferences given one voter's ranks
void record_preferences(int ranks[])
{
    // now that we have the ranks for an individual
    // voter we need to add them to preferences
    for (int i = 0; i < candidate_count; i++)
    {
        // go through the preferences matrix
        // if a voter prefers a over b update that
        // preference by 1
        for (int j = i + 1; j < candidate_count; j++)
        {
            preferences[ranks[i]][ranks[j]]++;
        }
    }
    return;
}

// Record pairs of candidates where one is preferred over the other
void add_pairs(void)
{
    // get the winner and loser of a pair and put into
    // pairs array if there is a tie. do not put
    // into array
    for (int i = 0; i < candidate_count; i++)
    {
        for (int j = i + 1; j < candidate_count; j++)
        {
            int candidate_x = preferences[i][j];
            int candidate_y = preferences[j][i];

            // checking to see who is the winner
            // between i and j (x and y)
            // if a beats b then but [a,b] into
            // the pairs array. no need to put [b,a]
            // beacuse b was a loser and we can see that
            // from the [a,b] that was put into the array
            if (candidate_x != candidate_y)
            {
                if (candidate_x > candidate_y)
                {
                    pairs[pair_count].winner = i;
                    pairs[pair_count].loser = j;
                    pair_count++;
                }
                else
                {
                    pairs[pair_count].winner = j;
                    pairs[pair_count].loser = i;
                    pair_count++;
                }
            }
        }
    }
    return;
}


// Sort pairs in decreasing order by strength of victory
void sort_pairs(void)
{
    int max_pref, max_index, possible_max;

    // sorting pairs using selection sort
    // we have a pairs array of the candidates that are favored
    // over another. example [a,c], here a beats c. where a and c
    // are the indexes in preferences so
    // preferences[pairs[x].winner][pairs[x].loser] will give us
    // preferences[a][c] were a is the winner and c is the loser
    for (int i = 0; i < pair_count; i++)
    {
        // start at beggining of array for each pass and set that to be
        // the current winner with the max preferences
        max_pref = preferences[ pairs[i].winner ][ pairs[i].loser ];
        max_index = i;
        // search the rest of the array for another winner who has a higher
        // preference then the current winner
        for (int j = i + 1; j < pair_count; j++)
        {
            possible_max = preferences[ pairs[j].winner ][ pairs[j].loser ];
            // if higher preference pair is found update the maximum preference
            if (possible_max > max_pref)
            {
                max_pref = possible_max;
                max_index = j;
            }
        }
        // if a higher preference pair was found then swap it when the first
        // pair at the beggining of current pass
        pair temp = pairs[i];
        pairs[i] = pairs[max_index];
        pairs[max_index] = temp;
    }
    return;
}

bool has_cycle(int source, int destination)
{
    // if the traceback says source and destination are the same
    // then this means that the candidate (destination) that we want
    // to point to is already a source (meaning we have seen this candidate
    // in the tree already). and pointing to this candidate will create a loop
    if (source == destination)
    {
        return true;
    }
    // check to see if any other candidate points to the source
    for (int i = 0; i < pair_count; i++)
    {
        // if a candidate points to the source check if it has a cycle
        // if someone is found to be pintint to c: example c -> source then check to see if
        // any candidate points to c (traceback) and so on
        if (locked[i][source] == true)
        {
            // go into has_cycle with the new candidate and the
            // original candidate (destination) that we want to point to
            return has_cycle(i, destination);
        }
    }
    return false;
}

// Lock pairs into the candidate graph in order, without creating cycles
void lock_pairs(void)
{
    // we have a pairs array or winners linked up with the candidate they beat (loser)
    // go through the pairs and see if we can lock pairs (link them up)
    // winner -> loser (winner points to loser)
    for (int i = 0; i < pair_count; i++)
    {
        // check to see if this linkage will create a cycle
        // if it doesnt then create a link by changing locked matrix
        // for that pair to true
        if (!has_cycle(pairs[i].winner, pairs[i].loser))
        {
            locked[pairs[i].winner][pairs[i].loser] = true;
        }
    }
    return;
}


// Print the winner of the election
void print_winner(void)
{
    // check each column to of the locked array for
    // any locked pairs (true)
    // if all the column is empty (all false)
    // then this means this canditate doesnt have any
    // one pointing to them
    bool pointed_to = false;
    for (int i = 0; i < pair_count; i++)
    {
        pointed_to = false;
        for (int j = 0; j < pair_count; j++)
        {
            // chekcing all the column 'i' for a locked pair
            if (locked[j][i] == true)
            {
                pointed_to = true;
            }
        }

        // if column came back with no locked pair (all false)
        // then this means no one is pointed to them and print them out
        if (pointed_to == false)
        {
            printf("%s\n", candidates[i]);
        }
    }
    return;
}

