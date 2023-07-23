def main():
    cc_number = input("Enter Credit Card Number: ")
    cc_length = len(cc_number)
    cc_number = int(cc_number)
    total = 0

    # promt the user for input
    if cc_length == 16 or cc_length == 15 or cc_length == 13:
        # if length is valid take second to last number
        # and every other number, Multiply by 2 and add
        for i in range(cc_length):
            # takes first 2 digits and stores them in 'first_digit' variable
            if i == cc_length - 2:
                first_digit = cc_number
            digit = (cc_number % 10) * 2
            cc_number = int(cc_number / 10)
            if (i % 2):
                # if digit is 10 or more split up and add individual integers
                if (digit > 9):
                    total = total + int(digit / 10) + int(digit % 10)
                # if total is 9 or less just add it to total
                else:
                    total = total + digit
            else:
                # if total is not part of every other number divide by
                # 2 to undo our previous multiplication
                total = total + int(digit / 2)

        # after total has been calculated check to see if it doesnt end in a 0
        # if it doesnt return invalid and quit
        # otherwise check the first digit
        if (total % 10 != 0):
            print("INVALID 1")
            return 1
        # check to see if American Express card
        if (first_digit == 34 or first_digit == 37):
            print("AMEX")
            return 0
        # checks to see if Mastercard card
        if (first_digit >= 51 and first_digit <= 55):
            print("MASTERCARD")
            return 0
        # checks to see if Visa card
        if (int(first_digit / 10) == 4):
            print("VISA")
            return 0
        # if none of above cards then card must be invalid
        else:
            print("INVALID")
            return 0
    else:
        print("INVALID")
        return 0


main()