-- Keep a log of any SQL queries you execute as you solve the mystery.

-- Time crime took place: July 28, 2020
-- Location of crime: Chamberlin Street

-- get names of tables and their column names
-- then with the information make a visual by linking up tables on a diagram
.schema

-- knowing the time it took place execute the following to get crime report for that day
SELECT description FROM crime_scene_reports WHERE month = 7 AND day = 28 AND year = 2020 AND street = "Chamberlin Street";

-- above query returns the folloing report regarding the duck:
-- **********************************************************************************
-- Theft of the CS50 duck took place at 10:15am at the Chamberlin Street courthouse.
-- Interviews were conducted today with three witnesses who were present at the
-- time — each of their interview transcripts mentions the courthouse.
-- **********************************************************************************
-- New information
-- Time of crime: 10:15 AM

-- looking at the interviews table to see interviews for that day
SELECT name, transcript FROM interviews WHERE year = 2020 AND month = 7 AND day = 28;

-- above query returns the following intervies transcipts regarding the robbery of the duck
-- for each of the 3 witnesses

-- ***************************************************************************************************************
-- Ruth    | Sometime within ten minutes of the theft, I saw the thief get into a car in the
--         | courthouse parking lot and drive away. If you have security footage from the courthouse
--         | parking lot, you might want to look for cars that left the parking lot in that time frame.

-- Eugene  | I don't know the thief's name, but it was someone I recognized. Earlier this morning,
--         | before I arrived at the courthouse, I was walking by the ATM on Fifer Street and saw the
--         | thief there withdrawing some money.

-- Raymond | As the thief was leaving the courthouse, they called someone who talked to them for less
--         | than a minute. In the call, I heard the thief say that they were planning to take the earliest
--         | flight out of Fiftyville tomorrow. The thief then asked the person on the other end of the phone
--         | to purchase the flight ticket.
-- ***************************************************************************************************************
-- New information
-- got into a car within 10 minutes of the crime
-- ATM was used by thief on Fifer Street to withraw some money.
-- Thief is planning to take earliest flight out of Fiftyville on July 29, 2020.
-- Thief asked the person on phone to purchase flight tickets which took less than a minute.

-- looking at the courthouse_security_logs table to see what vechicales exited the courthouse within 10 minutes of the crime
SELECT activity, license_plate FROM courthouse_security_logs WHERE year = 2020 AND month = 7 AND day = 28 AND hour = 10 AND minute >= 15 AND minute <= 25;

-- the above query results in the follwing license plates exiting the courthouse within 10 minutes of the theft.

-- *****************************
--  activity | license_plate
--      exit | 5P2BI95
--      exit | 94KL13X
--      exit | 6P58WS2
--      exit | 4328GD8
--      exit | G412CB7
--      exit | L93JTIZ
--      exit | 322W7JE
--      exit | 0NTHK55
-- *****************************
-- New information
-- 8 possible license plates

-- looking at the atm_transactions table for withraws on Fifer street on day of crime
 SELECT amount, account_number FROM atm_transactions
 WHERE year = 2020 AND month = 7 AND day = 28 AND atm_location = "Fifer Street" AND transaction_type = "withdraw";

-- the above query results in the following withraw transactions on the day of the crime
-- ***************************
--      amount | account_number
--          48 | 28500762
--          20 | 28296815
--          60 | 76054385
--          50 | 49610011
--          80 | 16153065
--          20 | 25506511
--          30 | 81061156
--          35 | 26013199
-- ***************************
-- New information
-- 8 bank account numnbers possibly linked to crime


-- looking at people table to linking that to bank_accounts table to get the name of the people using the atm on the above transactions
-- also only return the name if the person's license plate is was also spotted in the courhouse
-- to put it simply: return names of people whose licese plates and account numbers match the crime scene
SELECT name FROM people JOIN bank_accounts
ON bank_accounts.person_id = people.id
WHERE account_number
IN (SELECT account_number FROM atm_transactions
WHERE year = 2020 AND month = 7 AND day = 28 AND atm_location = "Fifer Street" AND transaction_type = "withdraw")
AND license_plate
IN (SELECT license_plate FROM courthouse_security_logs
WHERE year = 2020 AND month = 7 AND day = 28 AND hour = 10 AND minute >= 15 AND minute <= 25);

-- the above query returns the names of idiviuals who could be the thief.
-- ************
--  name
--  Ernest
--  Russell
--  Elizabeth
--  Danielle
-- ************
-- New information
-- 4 names of possible thieves

-- looking at airports table and flights table to see what the earliest flight was for JULY 29 2020
SELECT city, hour, minute FROM flights JOIN airports ON airports.id = origin_airport_id WHERE year = 2020 AND month = 7 AND day = 29;

-- the above query gives us the following result
-- ***************************************
--            city | hour | minute
--      Fiftyville | 16   | 0
--      Fiftyville | 12   | 15
--      Fiftyville | 8    | 20
--      Fiftyville | 9    | 30
--      Fiftyville | 15   | 20
-- ************************************
-- New information
-- Earliest flight from Fiftyville was 8:20 AM

-- looking at the flights table and the airports table to find out where that flight was headed to
SELECT city FROM flights JOIN airports ON airports.id = destination_airport_id WHERE year = 2020 AND month = 7 AND day = 29 AND hour = 8;

-- the above query gives the following result
-- ********
--  city
--  London
-- ********
-- New information
-- destinatino city was London

-- looking for name of people who where on the flight to London AND they are a suspect
SELECT name FROM people WHERE people.passport_number IN (SELECT passengers.passport_number FROM passengers JOIN flights ON flights.id = passengers.flight_id
JOIN airports ON airports.id = flights.destination_airport_id WHERE city = "London") AND name IN (
SELECT name FROM people JOIN bank_accounts
ON bank_accounts.person_id = people.id
WHERE account_number
IN (SELECT account_number FROM atm_transactions
WHERE year = 2020 AND month = 7 AND day = 28 AND atm_location = "Fifer Street" AND transaction_type = "withdraw")
AND license_plate
IN (SELECT license_plate FROM courthouse_security_logs
WHERE year = 2020 AND month = 7 AND day = 28 AND hour = 10 AND minute >= 15 AND minute <= 25));

-- the above query results in
-- **********
--  name
--  Danielle
--  Ernest
-- **********
-- New information
-- NULL

-- looking in phone_calls tablet to get numbers of each person
SELECT name, phone_number FROM people WHERE name IN ("Danielle", "Ernest");

-- the above query returns the result
-- **************************
--  Danielle | (389) 555-5198
--  Ernest   | (367) 555-5533
-- **************************
-- New information
-- Danielle has phone number (389) 555-5198
-- Ernest has phone number   (367) 555-5533

-- looking in phone_calls table to see what calls where made by Danielle and Ernest on the day of the robbery
SELECT caller, receiver, duration FROM phone_calls WHERE year = 2020 AND month = 7 AND day = 28 AND caller
IN (SELECT phone_number FROM people WHERE name IN ("Danielle", "Ernest"));

-- the above query resturns
-- ***********************************************
--       caller    |    receiver    | duration
--  (367) 555-5533 | (375) 555-8161 | 45
--  (367) 555-5533 | (344) 555-9601 | 120
--  (367) 555-5533 | (022) 555-4052 | 241
--  (367) 555-5533 | (704) 555-5790 | 75
-- ***********************************************
-- New information
-- only Ernest made calls that day
-- Ernest is the thief
-- only one call was less than a minute
-- Ernest must have called number (375) 555-8161 to help him book his flight

-- looking in people table to see whot the number (375) 555-8161 belongs to
SELECT name From people WHERE phone_number = "(375) 555-8161";

-- The above query returns the following result
-- **********
--  name
--  Berthold
-- **********
-- New information
-- accomplice's name is Berthold


-- Crime solved.
