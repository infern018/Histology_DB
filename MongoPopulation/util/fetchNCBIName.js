
const fetchBionomialName =  async (id) => {

    const axios = require('axios')

    axios
        .get(`https://rest.ensembl.org/taxonomy/classification/${id}?`)
        .then(res => res)
        .then(data => console.log(data))

    const res = await fetch(
        `https://rest.ensembl.org/taxonomy/classification/${id}?`,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    const json = await res.json();
    // console.log(json);
    return json[0].children[0];
}

module.exports = { fetchBionomialName }