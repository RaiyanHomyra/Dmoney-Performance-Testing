# Project Name: DMoney Performance Testing (JMeter)

## Project Description:
This project is a JMeter-based performance testing suite for the DMoney application. It simulates API transactions such as deposit, send money, and payment using CSV data files and generates an HTML performance report for analysis.

## Technology Used:
* Apache JMeter
* CSV Data Set Config
* HTML Report Dashboard
* Git & GitHub

## How to Run:
* Open Apache JMeter and load the `dmoney.jmx` file
* Run test in non-GUI mode:

## Test Scenarios:
1. **Deposit Money** — System deposits money to the agent account using CSV data
2. **Send Money** — Customer transfers money to another customer
3. **Payment** — Customer makes payment through the merchant 
4. **CSV Data Driven Testing** — Test cases executed using multiple data sets:
 - deposit.csv
 - sendMoney.csv
 - payment.csv
5. **Performance Analysis** — Evaluate response time, throughput, and error rate

## Project Structure:
- dmoney.jmx → Main JMeter test plan  
- Resources/ → CSV test data files  
- deposit.csv  
- sendMoney.csv  
- payment.csv  
- HTML-Report/ → Generated performance report  
- Screenshots/ → Report images  
- request-summary.png  
- statistics.png  
### Test and Report Information 
<img width="1634" height="777" alt="image" src="https://github.com/user-attachments/assets/d2654737-7292-47e8-9b75-6122e3caa46b" />

### Statistics
<img width="1627" height="585" alt="image" src="https://github.com/user-attachments/assets/32b90957-6181-4512-95f9-b18ceecb87a9" />

### Errors
<img width="1597" height="754" alt="image" src="https://github.com/user-attachments/assets/a8c7f825-8ffa-4d4e-a092-5f04bb9f22ea" />

## Notes:
All test executions were performed using Apache JMeter in non-GUI mode, and the results were analyzed using the HTML report dashboard.

## Author:
Raiyan Islam Homyra
