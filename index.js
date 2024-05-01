// import Web3 from 'web3';

const contractAddresses = [
	'0xA03b6d90196E173B5AC1DdE4F8754A1CF31b9656',
	'0xB6E5b3025C6EcaEc0577C11Bf84f501420E64f1f',
    '0x7D745e912fc09725d93f3F5b9F8F106Bd4a68e93',
	
    // Add more contract addresses here for additional elections
];

const abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_candidateId",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "_candidateId",
				"type": "uint256"
			}
		],
		"name": "votedEvent",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "candidateCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidates",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "candidatesCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "electionName",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_candidateId",
				"type": "uint256"
			}
		],
		"name": "voteCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "voters",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
// Detect MetaMask in WebApp
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
}


document.addEventListener("DOMContentLoaded", async () => {
    const web3 = new Web3(window.ethereum);
    const electionsList = document.getElementById("elections-list");

    contractAddresses.forEach((address, index) => {
        const myContract = new web3.eth.Contract(abi, address);
        const button = document.createElement("button");
        button.classList.add("list-group-item", "list-group-item-action");

        // button.textContent = `Election ${index + 1}`;
        myContract.methods.electionName().call((error, result) => {
            button.textContent = result;
        });

        button.addEventListener("click", () => showElectionDetails(address));
        electionsList.appendChild(button);
    });
});

async function showElectionDetails(contractAddress) {
    const web3 = new Web3(window.ethereum);
    const myContract = new web3.eth.Contract(abi, contractAddress);
    
    const electionTitle = document.getElementById("election-title");
    const electionCandidates = document.getElementById("election-candidates");
    const candidateOptions = document.getElementById("candidate-options");
    const voteForm = document.getElementById("vote-form");
    const errorMsg = document.getElementById("error-msg");
    const backBtn = document.getElementById("back-btn");

    electionCandidates.innerHTML = "";
    candidateOptions.innerHTML = "";
    errorMsg.textContent = "";

    myContract.methods.candidateCount().call(async (error, result) => {
        if (error) {
            console.error(error);
            errorMsg.textContent = "Error fetching election details. Please try again later.";
            return;
        }
        electionTitle.textContent = "Election Details";
        voteForm.style.display = "block";
        backBtn.style.display = "block";

        for (let i = 1; i <= result; i++) {
            const candidate = await myContract.methods.candidates(i).call();
            const candidateName = candidate.name;
            const votes = candidate.voteCount;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${candidateName}</td>
                <td>${votes}</td>
            `;
            electionCandidates.appendChild(row);

            const option = document.createElement("option");
            option.value = i;
            option.textContent = candidateName;
            candidateOptions.appendChild(option);
        }
        document.getElementById("election-details").style.display="block"
    });

    voteForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const candidate = voteForm.elements["candidate"].value;
        await sendVote(contractAddress, candidate);
    });

    backBtn.addEventListener("click", () => {
        electionTitle.textContent = "";
        electionCandidates.innerHTML = "";
        voteForm.style.display = "none";
        backBtn.style.display = "none";
    });
}

async function sendVote(contractAddress, candidate) {
    const web3 = new Web3(window.ethereum);
    const myContract = new web3.eth.Contract(abi, contractAddress);

    const transactionParameters = {
        to: contractAddress,
        from: await getAccount(),
        data: myContract.methods.vote(candidate).encodeABI()
    };

    try {
        const txHash = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });
        console.log(txHash);
    } catch (error) {
        console.error(error);
        alert("Error casting vote. You may have already voted. If not, contact contract owner.");
    }
}

// Request accounts
async function getAccount() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    return account;
}