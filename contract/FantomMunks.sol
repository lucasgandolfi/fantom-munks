pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FantomMunks is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIdCounter;
    address payable public depositAddress = payable(0xFc3778f4b877B25A2A6B501a6Bd987bB6B43F7e0);
    uint256 public maxMintable = 555;
    uint256 public mintPrice = 1 ether;
    string private _baseUrl;
    string public baseExtension = ".json";

    constructor(string memory baseUrl) ERC721("FantomMunks", "MNK") {
        _baseUrl = baseUrl;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseUrl;
    }

    function claim(uint256 quantity) public payable {
        require(quantity > 0, "Invalid amount");
        require((_tokenIdCounter.current() + quantity) < (maxMintable), "No more Munks are available");
        
        uint256 price = mintPrice * quantity;

        require(msg.value >= price, "Invalid amount");
        
        // transfer amount to owner
        depositAddress.transfer(price);

        for (uint256 i = 0; i < quantity; i++) {
            uint256 id = _tokenIdCounter.current();
            _safeMint(msg.sender, id);

            _tokenIdCounter.increment();
        }
    }

    function setTokenURI(uint256 tokenId, string memory newURI) public onlyOwner {
        _setTokenURI(tokenId, newURI);
    }
    
    function setBaseURL(string memory newBase) public onlyOwner {
        _baseUrl = newBase;
    }
    
    function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
        baseExtension = _newBaseExtension;
    }
    
    function setDepositAddress(address payable to) public onlyOwner {
        depositAddress = to;
    }
    
    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(
          _exists(tokenId),
          "ERC721Metadata: URI query for nonexistent token"
        );
    
        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
            : "";
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}