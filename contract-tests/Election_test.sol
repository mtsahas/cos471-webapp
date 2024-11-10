// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.22 <0.9.0;
import "remix_tests.sol";
import "remix_accounts.sol";
import "../contracts/Election.sol";

contract testSuite {
    Election myElection;
    address owner;
    uint candidateId1;
    uint candidateId2;


    /// 'beforeAll' runs before all other tests
    /// More special functions are: 'beforeEach', 'beforeAll', 'afterEach' & 'afterAll'
    function beforeAll() public {
        myElection = new Election();
        owner = msg.sender;
        uint candidateId1 = 1;
        uint candidateId2 = 5;
    }

    function checkInitialVote() public {
        uint count1 = myElection.voteCount(candidateId1);
        uint count2 = myElection.voteCount(candidateId2);
        Assert.equal(count1, 0, "Vote counts start at 0. (candidate 1)");
        Assert.equal(count2, 0, "Vote counts start at 0. (candidate 2)");
    }
    function candidateCount() public{
        Assert.equal(myElection.candidatesCount(), 2, "Two candidates.");
    }
    function checkVote() public {
        myElection.vote(candidateId1);
        uint count1 = myElection.voteCount(candidateId1);
        uint count2 = myElection.voteCount(candidateId2);
        Assert.equal(count1, 1, "Vote counts start at 1. (candidate 1)");
        Assert.equal(count2, 0, "Vote counts start at 0. (candidate 2)");
    }

}