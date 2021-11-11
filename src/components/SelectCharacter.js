import { useState, useEffect } from 'react'

import { Box, Button, Flex, Heading, Stack } from '@chakra-ui/react'
import { ethers } from 'ethers'

import { CONTRACT_ADDRESS, transformCharacterData } from '../constants'
import myEpicGame from '../utils/MyEpicGame.json'

import CharacterCard from './CharacterCard'

const SelectCharacter = ({ setCharacterNFT }) => {
  const [characters, setCharacters] = useState([])
  const [gameContract, setGameContract] = useState(null)

  const mintCharacterNFTAction = async (characterId) => {
    try {
      if (gameContract) {
        console.log('Minting character in progress...')
        const mintTxn = await gameContract.mintCharacterNFT(characterId)
        await mintTxn.wait()
        console.log('mintTxn: ', mintTxn)
      }
    } catch (error) {
      console.warn('MintCharacterAction Error: ', error)
    }
  }

  useEffect(() => {
    const { ethereum } = window
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      )
      setGameContract(gameContract)
    } else {
      console.warn('Ethereum object not found.')
    }
  }, [])

  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log('Getting contract characters to mint')

        const charactersTxn = await gameContract.getAllDefaultCharacters()
        console.log('charactersTxn: ', charactersTxn)

        const characters = charactersTxn.map((characterData) =>
          transformCharacterData(characterData)
        )

        setCharacters(characters)
      } catch (error) {
        console.log('Something went wrong fetching characters: ', error)
      }
    }

    // Add a callback method that will fire when this minting event is received
    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender}, tokenId: ${tokenId.toNumber()}, characterIndex: ${characterIndex.toNumber()}`
      )

      // Once our character NFT is minted we can fetch the metadata from our contract
      // and set it in state to move onto the Arena
      if (gameContract) {
        const characterNFT = await gameContract.checkIfUserHasNFT()
        console.log('CharacterNFT: ', characterNFT)
        setCharacterNFT(transformCharacterData(characterNFT))
        alert(
          `Your NFT is all done -- see it here: https://testnets.opensea.io/assets/${
            gameContract.address
          }/${tokenId.toNumber()}`
        )
      }
    }

    if (gameContract) {
      getCharacters()
      // Setup NFT Minted listener
      gameContract.on('CharacterNFTMinted', onCharacterMint)
    }

    // When your component unmount, let's make sure to clean up this listener
    return () => {
      if (gameContract) {
        gameContract.off('CharacterNFTMinted', onCharacterMint)
      }
    }
  }, [gameContract, setCharacterNFT])

  const renderCharacters = () => {
    return characters.map((character, index) => (
      <Flex key={character.name} w="full" direction="column" align="center">
        <CharacterCard
          name={character.name}
          image={character.imageURI}
          hp={character.hp}
          maxHp={character.maxHp}
        />
        <Button
          mt="10"
          onClick={() => {
            mintCharacterNFTAction(index)
          }}
        >
          Mint {character.name}
        </Button>
      </Flex>
    ))
  }

  return (
    <Box w="full" maxW="1110px" mx="auto">
      <Heading as="h2" color="white" textAlign="center" mb="10">
        Mint Your Hero. Choose wisely.
      </Heading>
      {characters.length > 0 && (
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          spacing="0"
          justify="center"
          align="center"
        >
          {renderCharacters()}
        </Stack>
      )}
    </Box>
  )
}

export default SelectCharacter
