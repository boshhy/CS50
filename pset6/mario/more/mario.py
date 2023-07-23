# program prints out mario pyramid (left and right side)
from cs50 import get_int

# promt user for height of pyramid between (1-8)
while True:
    height = get_int("Height: ")
    if height > 0 and height < 9:
        break

blocks = height
while height > 0:
    spaces = height - 1

    # print number of spaces
    for i in range(spaces):
        print(' ', end='')

    # print number of blocks
    for i in range(spaces, blocks, 1):
        print('#', end='')

    # print out the two spaces
    print('  ', end='')

    # print out same number of blocks
    for i in range(spaces, blocks, 1):
        print('#', end='')

    # go to next line of pyramid
    print()
    height -= 1