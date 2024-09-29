# ETF ACB Calculator

## Overview

The ETF ACB Calculator is a web-based tool designed to help investors calculate and track the Adjusted Cost Base (ACB) of their Exchange-Traded Fund (ETF) investments. This calculator supports various types of investment activities and provides a clear view of your ETF portfolio's cost basis.

## Features

- Add and manage multiple ETFs in your portfolio
- Support for various activity types:
  - Buy
  - Sell
  - Reinvest (Dividend)
  - ROC (Return of Capital)
  - RCGD (Reinvested Capital Gains Distribution)
  - Split
- Automatic ACB calculation for each ETF
- Running total of shares, ACB per share, and total value for each activity
- Overall portfolio summary
- Local storage to save your portfolio data
- Edit and remove individual activities
- Remove entire ETFs from your portfolio

## How to Use

1. Open `acb-cal.html` in your web browser.
2. Use the form at the top to add new activities:
   - Enter the ETF ticker
   - Select the activity type
   - Enter the number of shares
   - Enter the price per share
   - Select the date of the activity
3. Click "Add Activity" to record the transaction
4. View your ETF portfolio below the form, which shows:
   - Individual activities for each ETF
   - Running totals after each activity
   - Summary for each ETF
   - Overall portfolio summary

## Technical Details

- The project consists of two main files:
  - `acb-cal.html`: The HTML structure of the application
  - `main.js`: The JavaScript file containing all the logic for calculations and UI updates
- Data is stored in the browser's local storage, allowing persistence between sessions
- The application uses vanilla JavaScript without any external libraries or frameworks

## Calculations

The ACB is calculated using the following logic:
- For Buy and Reinvest activities, the total cost increases
- For Sell activities, the number of shares decreases
- ROC activities decrease the total cost
- RCGD activities increase the total cost
- Split activities multiply the number of shares

The ACB per share is calculated by dividing the total cost by the number of shares.

## Limitations

- The calculator assumes all transactions are in the same currency
- It does not account for foreign exchange rates or currency conversions
- The application does not provide tax advice or generate tax reports

## Future Improvements

- Add data export functionality
- Implement data import from CSV files
- Add visualizations for portfolio performance
- Include currency conversion support

## Disclaimer

This tool is for informational purposes only and should not be considered as financial or tax advice. Always consult with a qualified financial advisor or tax professional for your specific situation.
