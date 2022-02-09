// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

contract SwordsGoldenScarlet is
    ERC721,
    ERC721Enumerable,
    Ownable,
    IERC2981
{
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIdCounter;

    // Address to pay the mint and royalties
    address payable public depositAddress =
        payable(0x254F9595cA1C2E567C51d5B44f0f43Cf485ef154);

    string private baseUri = "https://www.munksnft.com/api/swords/";

    uint256 public royaltiesPercentage = 7;

    constructor() ERC721("FantomMunks SWORDS - Golden Scarlet", "SWORDSGS") { }

    function _baseURI() internal view override returns (string memory) {
        return baseUri;
    }

    function claim() public payable {
        require(false, "You cannot mint swords, sorry anom");
    }

    function airdrop(uint256[] memory quantities, address[] memory receivers) public payable onlyOwner {
        for (uint i=0; i < receivers.length; i++) {
            uint256 quantity = quantities[i];
            address receiver = receivers[i];
            
            require(quantity > 0, "Invalid amount");

            for (uint i = 0; i < quantity; i++) {
                uint256 id = _tokenIdCounter.current();
                _safeMint(receiver, id);

                _tokenIdCounter.increment();
            }
        }
    }

    function setBaseURI(string memory newURI) public onlyOwner {
        baseUri = newURI;
    }

    // Change the deposit address
    function setDepositAddress(address payable to) public onlyOwner {
        depositAddress = to;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721)
    {
        super._burn(tokenId);
    }

    // Returnes the URI of the token
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721)
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        ".json"
                    )
                )
                : "";
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, IERC165)
        returns (bool)
    {
        return
        type(IERC2981).interfaceId == interfaceId ||
        super.supportsInterface(interfaceId);
    }

    // Change royalties percentage in secondary sales
    function setRoyaltiesPercentage(uint256 newPercentage) public onlyOwner {
        royaltiesPercentage = newPercentage;
    }

    // EIP-2981: Royalty Standard
    function royaltyInfo(uint256 tokenId, uint256 _salePrice)
        external
        view
        override(IERC2981)
        returns (address receiver, uint256 royaltyAmount)
    {
        uint256 _royalties = ((_salePrice * royaltiesPercentage) / 100);
        return (depositAddress, _royalties);
    }
}