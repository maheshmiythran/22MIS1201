stage 1 - priority notifications

this folder has the script for stage 1. it gets notifications from the test server and finds the top 10 based on priority and recency.

priority logic:
1. Placement (highest)
2. Result
3. Event (lowest)
if types are same, the latest timestamp comes first.

to run this:
npm install
npm start


output screenshot:

![alt text](<output screenshots/notification.png>)