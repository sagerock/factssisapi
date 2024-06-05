pm.test("Send sorted contacts individually to Zapier", function () {
    var jsonData = pm.response.json().results;

    // Define a mapping from birth year date range to Constant Contact tag IDs
    var birthYearTagIds = {
        "6/1/2009 - 5/31/2010": "3c91c4c8-40f2-11ed-b67b-fa163efab12a",
        "6/1/2010 - 5/31/2011": "c8e7a89e-7a58-11ed-b6a3-fa163ef34398",
        "6/1/2011 - 5/31/2012": "8406e7f8-905b-11ed-9daf-fa163e25e9d8",
        "6/1/2012 - 5/31/2013": "8c5d51f8-2891-11ed-82eb-fa163e25e9d8",
        "6/1/2013 - 5/31/2014": "05313e4c-53cf-11ed-bdb1-fa163e37a129",
        "6/1/2014 - 5/31/2015": "acf31f0c-2890-11ed-a74d-fa163e732e35",
        "6/1/2015 - 5/31/2016": "37fe9130-2891-11ed-9494-fa163efab12a",
        "6/1/2016 - 5/31/2017": "ca1d8596-288f-11ed-9840-fa163e37a129",
        "6/1/2017 - 5/31/2018": "e6343a22-288f-11ed-87e3-fa163e37a129",
        "6/1/2018 - 5/31/2019": "8ac77fe6-288f-11ed-a30d-fa163eeaf818",
        "6/1/2019 - 5/31/2020": "86a843ca-2892-11ed-b066-fa163e638ddc",
        "6/1/2020 - 5/31/2021": "2beeb38e-b2b6-11ed-9d04-fa163edce0e0",
        "6/1/2021 - 5/31/2022": "10dc1762-b2b6-11ed-ac9a-fa163edce0e0",
        "6/1/2022 - 5/31/2023": "67b9c046-c43c-11ee-be83-fa163e638ddc",
        "6/1/2023 - 5/31/2024": "703d4b52-c43c-11ee-be83-fa163e638ddc",
        "6/1/2024 - 5/31/2025": "965d281e-22b2-11ef-baac-fa163edce0e0"
    };

    // Get the current date and time
    var now = new Date();
    // Define the time range for the last 24 hours
    var oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Filter contacts for those with inquiry dates within the last 24 hours
    var recentContacts = jsonData.filter(contact => {
        let inquiryDate = new Date(contact.standard.find(x => x.question.id === 37).answer.dateValue);
        return inquiryDate >= oneDayAgo && inquiryDate <= now;
    });

    // Sort the recent contacts by inquiry date
    recentContacts.sort((a, b) => {
        let dateA = new Date(a.standard.find(x => x.question.id === 37).answer.dateValue);
        let dateB = new Date(b.standard.find(x => x.question.id === 37).answer.dateValue);
        return dateB - dateA;
    });

    // Prepare and send each contact individually
    recentContacts.forEach(contact => {
        var details = contact.standard.reduce((acc, record) => {
            if (record.question.id === 11) acc.firstName = record.answer.textValue;
            else if (record.question.id === 13) acc.lastName = record.answer.textValue;
            else if (record.question.id === 16) acc.emailAddress = record.answer.textValue || "N/A";
            else if (record.question.id === 37) acc.inquiryDate = record.answer.dateValue;
            else if (record.question.id === 28) acc.schoolYear = record.answer.textValue;
            return acc;
        }, {});

        // Extract birth year from the custom data and map to tag ID
        contact.custom.forEach(function (record) {
            if (record.question.id === 1) {
                let keyValue = record.answer.intValue;
                let option = record.question.options.find(opt => opt.keyValue === keyValue);
                if (option) {
                    details.tagId = birthYearTagIds[option.display] || "Unknown";
                } else {
                    details.tagId = "Unknown";
                }
            }
        });

        // Prepare the payload for each contact
        var payload = {
            email_address: details.emailAddress,
            first_name: details.firstName,
            last_name: details.lastName,
            custom_fields: {
                inquiry_date: details.inquiryDate,
                school_year: details.schoolYear,
            },
            tags: [details.tagId]
        };

        // Log the payload for debugging
        console.log("Payload:", payload);

        // Send the payload to Zapier
        pm.sendRequest({
            url: "https://hooks.zapier.com/hooks/catch/17327511/2ylkghn6/",
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            body: {
                mode: 'raw',
                raw: JSON.stringify(payload)
            }
        }, function (err, res) {
            if (err) {
                console.log("Error sending data to Zapier:", err);
            } else {
                console.log("Data sent to Zapier successfully");
            }
        });
    });
});
