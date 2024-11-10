// SPDX-License-Identifier: MIT
pragma solidity >=0.6.12 <0.9.0;

contract Election {
    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Store accounts that have voted
    mapping(address => bool) public voters;
    // Store Candidates
    // Fetch Candidate
    mapping(uint => Candidate) public candidates;
    // Store Candidates Count
    uint public candidatesCount;
    string public electionName;

    // voted event
    event votedEvent (
        uint indexed _candidateId
    );
    // warning about visibility for constructor
    constructor() {
        electionName = "Young Alumni Trustee Election";
        addCandidate("Stephen Daniels");
        addCandidate("Aisha Chebbi");
        addCandidate("Luke Chan");
        addCandidate("Alison Lee");
        addCandidate("Ben Cai");

    }

    function addCandidate (string memory _name) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote (uint _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount ++;

        // trigger voted event
        emit votedEvent(_candidateId);
    }
    function voteCount(uint _candidateId) view public returns (uint){
      return candidates[_candidateId].voteCount;
    }
    function candidateCount() view public returns (uint){
      return candidatesCount;
    }
}