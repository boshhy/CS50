import csv
import sys

# if no argument this should exit the program with displayed text
if len(sys.argv) != 3:
    sys.exit("Usage: python dna.py DATABASE_FILENAME SEQUENCE_FILENAME")

# 'dna_strands' will hold the person name and thier associated dna sequence along with count for
# that one person
# 'strands' will hold the strands and how oftern it appears in the sequence provided
dna_strands = []
strands = {}

# open the csv file for the people and their strands append informationto 'dna_stands'
with open(sys.argv[1], 'r') as database:
    reader = csv.DictReader(database)
    for row in reader:
        dna_strands.append(row)

# open the same csv file from above but only to read the first line and make a dictionary of
# strands and the count for each strand
with open(sys.argv[1], 'r') as database:
    reader = csv.reader(database)
    first_row = next(reader)
    for i in range(1, len(first_row), 1):
        strands[first_row[i]] = 0

# open the csv file that contains the dna sequence and save it to 'row'
# this information will remain in row even though reader will be closed
# once block of code terminates
with open(sys.argv[2], 'r') as dna:
    reader = csv.reader(dna)
    row = next(reader)

# for each key aka dna strand in 'strands' go through and see if its found in row[0] (dna sequence provided above)
for key in strands:
    total = 1
    # go through and see what the largest sequential of time a key appears in the dna sequence provided
    # if found total will increase by one and keep multiplying key ex. atag*3 = atagatagatag
    while key*total in row[0]:
        # if the total sequence appearing for that key strand then set the strands[key] equal to the new higher sequential total
        if total > strands[key]:
            strands[key] = total
        total += 1
# after above block of code is complete the strands dictionary now hold the strands and their respective largest sequential
# times found in dna strand provided

# setting a boolean varable to check if we have a match, this is only used to print out
# no match in case no match was found
found = False

# go through the dictionary of people and thier dna, compare their dna count to the one in strands
# if one match is found go and check the next key for the same person.
for i in range(len(dna_strands)):
    total = 0
    for key in strands:
        if int(dna_strands[i][key]) == strands[key]:
            total += 1
        # if count did not match for a persons dna, then break and go to the next person, no need
        # to check the rest of dna for current person
        else:
            break
    # if all dna strands match a persons dna then print out that persons name and break out, no need to check
    # other people
    if total == len(strands):
        found = True
        print(dna_strands[i]["name"])
        break

# if no match was found print out 'no match'
if (not found):
    print("No Match")
