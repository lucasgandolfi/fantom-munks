import React, { useState, useEffect, Fragment } from "react";
let Web3 = require("web3");
import Image from 'next/image'
import Swal from 'sweetalert2'

function Index() {
  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(0);
  const [maxMintable, setMaxMintable] = useState(0);
  const [supply, setSupply] = useState(0);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [tokenTest, setTokenTest] = useState(null);


  let abi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "claim",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "newBase",
          "type": "string"
        }
      ],
      "name": "setBaseURI",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "setDepositAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "newURI",
          "type": "string"
        }
      ],
      "name": "setTokenURI",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "baseUrl",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
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
      "name": "depositAddress",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "maxMintable",
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
      "name": "name",
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
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
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
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "tokenByIndex",
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
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "tokenOfOwnerByIndex",
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
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
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
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  let contractAddress = "0x5c7128f36b799384A896D8368dF4f67BBD03C12B";

  useEffect(() => {
    connectWallet();
  }, []);

  function connectWallet(){
    if(!window.ethereum){
      alert("Please install MetaMask");
      setIsReady(false);
      return;
    }
    
    ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          setAddress(accounts[0]);
          //let w3 = new Web3(ethereum);
          let w3 = new Web3(window.web3.currentProvider);
          setWeb3(w3);
          let c = new w3.eth.Contract(abi, contractAddress);
          setContract(c);
          console.log(c);

          c.methods
            .totalSupply()
            .call()
            .then((supply) => {
              setIsReady(true);
              setSupply(supply);
            })
            .catch((err) => {
              setIsReady(false);
              setAddress(null);
              setSupply(0);
              setBalance(0);
              setMaxMintable(0);
              setContract(null);
              Swal.fire({
                title: 'Error!',
                html: 'Check if you are using the Fantom Network',
                icon: 'error',
                confirmButtonText: 'Ok'
              })
              console.log(err)
            });

          c.methods
            .maxMintable()
            .call()
            .then((maxMintable) => {
              setMaxMintable(maxMintable);
            })
            .catch((err) => console.log(err));

          c.methods
            .balanceOf(accounts[0])
            .call()
            .then((_balance) => {
              setBalance(_balance);
            })
            .catch((err) => console.log(err));

        })
        .catch((err) => {
          setIsReady(false);
          Swal.fire({
            title: 'Error!',
            html: 'Check if you are using the Fantom Network',
            icon: 'error',
            confirmButtonText: 'Ok'
          })
          console.log(err)
        })      
  }

  function handleClaim() {
    let tx = claim();
    console.log(tx);
  }

  async function loadData() {
    let totalSupply = await contract.methods
      .totalSupply()
      .call();

    setSupply(totalSupply);



    contract.methods
      .maxMintable()
      .call()
      .then((maxMintable) => {
        setMaxMintable(maxMintable);
      })
      .catch((err) => console.log(err));

    contract.methods
      .balanceOf(address)
      .call()
      .then((_balance) => {
        setBalance(_balance);
      })
      .catch((err) => console.log(err));

  }

  function claim() {
    setIsClaiming(true);
    let _price = web3.utils.toWei("1");

    contract.methods
      .claim()
      .send({
        gasLimit: "285000",
        to: contractAddress,
        from: address,
        value: _price,
      })
      .once("error", (err) => {
        console.log(err);
        setIsClaiming(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setIsClaiming(false);
        loadData();

        const link = 'https://ftmscan.com/tx/' + receipt.transactionHash 

        Swal.fire({
          title: 'Success!',
          html: 'You can check the transaction at <a href="' + link + '" target="_blank" style="color: blue">Ftmscan</a>',
          icon: 'success',
          confirmButtonText: 'Cool'
        })
      });
  }

  return (
    <Fragment>
      <div className="geeks"></div>
      <div className="header">
        <div className="tittle colorGradient">FANTOM MUNKS - NFT Collection</div>

        <div className='menus'>
          <div>You own ({balance}) Munks</div>
        </div>

        <button className='button' onClick={connectWallet}>
          {isReady ? address?.substring(0, 6) + "..." + address?.substring(address.length - 4, address.length) : "Connect" } {}
        </button>
      </div>

      <div id="app">
        <div className="form-container">
          <div className='content-container'>
            <div style={{ flex: 1}} className='image-frame'>
              <Image src='/assets/munk1.gif' alt='munk' width='128' height='128' />
              <Image src='/assets/munk2.gif' alt='munk' width='128' height='128' />
              <Image src='/assets/munk3.gif' alt='munk' width='128' height='128' />
            </div>

            <div style={{ flex: 3 }}>

              <br />
              THIS IS NOT REALEASED. DO NOT MINT.
              <br />

              This is the first collection created inside the <div className='colorGradient'>MUNKVERSE.</div>
              <br />
              <br />

              What is the <div className='colorGradient'>MUNKVERSE</div>?
              <br />

              It's just where all Munks live.
              <br />
              Munk is a character created by 16 years old's mind around 2008.
              <br />

              I've never stopped drawing this same character.
              <br />
              Now I think it's perfect for NFTs.
              <br />
              I hope you stick around to see more.
              
              <br />
              <br />

              This would not be possible without the amazing project:
              <br />
              <div className='colorGradient'>Fantom Chess.</div>
              <br />
              
              Please, check it at <a href='https://www.fantomchess.com' className='mr-10' target='_blank'><div className='colorGradient'>fantomchess.com</div></a>
              <br />

              <br />
              <br />

              There are <div className='colorGradient'>10.000</div> Munks ready to be claim.
              <br />

              <br />


              <br />
              <br />

              <br />

              Price: <div className='colorGradient'>1 FTM</div> each

              <br />
              <br />

              <a href='https://twitter.com/munks_nft' target='_blank' className='mr-10'>
                <Image src='/assets/twitter.svg' alt='munk' width='20' height='20' />
              </a>

              <a href='https://ftmscan.com/address/ADRESS' className='mr-10' target='_blank'>
                <Image src='/assets/fantom.svg' alt='munk' width='20' height='20' />
              </a>
            </div>
          </div>

          <br />

          {isReady && <div>Available {maxMintable - supply}/{maxMintable}</div>}

          {isReady && <button className='button' style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 20}} onClick={handleClaim}>
            { isClaiming ? 'loading...' : 'Claim (1 FTM)' }
          </button>}

          {!isReady && <div className='colorGradient'><br></br>Connect your wallet to claim</div>}
        </div>
      </div>
    </Fragment>
  );
}

export default Index;
