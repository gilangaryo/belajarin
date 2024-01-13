const getBank = async function fetchCategories(req, res) {
    try {
        const response = await fetch('file://D:/Hackfest/backendku/controllers/indonesia-bank.json');


        // Check if the response is successful (status code 200) and the content type is JSON
        if (response.ok && response.headers.get('content-type').includes('application/json')) {
            const data = await response.json();
            console.log('Response:', response);

            // Send the fetched data as a response
            res.send(data);
        } else {
            console.error('Error fetching categories:', response.status, response.statusText);

            // Send an error response
            res.status(response.status).send({ error: 'Error fetching categories' });
        }
    } catch (error) {
        console.error('Error fetching categories:', error);

        // Send an error response
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
module.exports = { getBank };
