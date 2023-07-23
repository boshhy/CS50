# create variable to hold text, leght of text, letter count, word count, and sentences respectively
the_text = input("Text: ")
length_of_text = len(the_text)
letters = 0
words = 1
sentences = 0

# go through the input text character by character
for i in range(length_of_text):
    c = the_text[i]

    # if c is alphabetical then add 1 to letters
    if c.isalpha():
        letters += 1
    # if c is a space then add 1 to words
    if c.isspace():
        words += 1
    # if c is a '.' or '!' or '?' add 1 to sentences
    if c == '.' or c == '!' or c == '?':
        sentences += 1

# calculate Coleman-Liau index and round off. set grade to result
grade = round(0.0588 * (letters * 100.0 / words) - 0.296 * (sentences * 100.0 / words) - 15.8)

# print out the greade level
if grade < 1:
    print("Before Grade 1")
elif grade >= 16:
    print("Grade 16+")
else:
    print(f"Grade {grade}")