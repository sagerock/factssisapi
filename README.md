# Send Sorted Contacts to Zapier

This repository contains a Postman test script to filter, sort, and send contact data to Zapier. The script is designed to work with contact inquiry data, mapping birth years to specific tags and sending the data of recent contacts to a Zapier webhook.

## Features

- Filters contacts based on inquiry dates within the last 24 hours.
- Sorts the filtered contacts by inquiry date.
- Maps birth year date ranges to Constant Contact tag IDs.
- Sends the contact data individually to a specified Zapier webhook.

## Usage

1. Copy the code from `send_sorted_contacts_to_zapier.js` into your Postman test script.
2. Run the request in Postman to trigger the script.
3. The script will filter, sort, and send contact data to the configured Zapier webhook.

## Configuration

- **Zapier Webhook URL**: Update the URL in the `pm.sendRequest` function to point to your specific Zapier webhook.

## Dependencies

- Postman: Ensure you have Postman installed to run the test script.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
