import { useEffect, useState } from 'react'

import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { NextSeo } from 'next-seo'
import NextImage from 'next/image'

import gohanGif from '../assets/gohan.gif'
import Arena from '../components/Arena'
import SelectCharacter from '../components/SelectCharacter'
import { CONTRACT_ADDRESS, transformCharacterData } from '../constants'
import myEpicGame from '../utils/MyEpicGame.json'

export default function Home() {
  // Just a state variable we use to store our user's public wallet. Don't forget to import useState.
  const [currentAccount, setCurrentAccount] = useState(null)
  const [characterNFT, setCharacterNFT] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Since this method will take some time, make sure to declare it as async
  const checkIfWalletIsConnected = async () => {
    try {
      // First make sure we have access to window.ethereum
      const { ethereum } = window

      if (!ethereum) {
        console.log('Make sure you have MetaMask!')
        setIsLoading(false)
        return
      } else {
        console.log('We have the ethereum object', ethereum)
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length !== 0) {
        const account = accounts[0]
        console.log('Found an authorized account:', account)
        setCurrentAccount(account)
      } else {
        console.log('No authorized account found')
      }
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window
      if (!ethereum) {
        alert('Get MetaMask!')
        return
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Connected', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }

  // This runs our function when the page loads.
  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      setIsLoading(true)
      console.log('Checking for Character NFT on address: ', currentAccount)

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      )

      const txn = await gameContract.checkIfUserHasNFT()
      if (txn.name) {
        console.log('User has character NFT')
        setCharacterNFT(transformCharacterData(txn))
      } else {
        console.log('No character NFT found')
      }
      setIsLoading(false)
    }

    if (currentAccount) {
      console.log('Current Account: ', currentAccount)
      fetchNFTMetadata()
    }
  }, [currentAccount])

  const renderContent = () => {
    if (!currentAccount) {
      return (
        <VStack>
          <Box rounded="2xl" overflow="hidden" display="inline-flex" mb="12">
            <NextImage src={gohanGif} />
          </Box>
          <Button
            onClick={connectWalletAction}
            colorScheme="orange"
            size="lg"
            rounded="md"
          >
            Connect Wallet To Get Started
          </Button>
        </VStack>
      )
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />
    } else if (currentAccount && characterNFT) {
      return (
        <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
      )
    }
  }

  return (
    <Box>
      {/* Edit the Head info */}
      <NextSeo title="Home" description="NFT DragonVerse game" />

      <Flex
        role="main"
        direction="column"
        align="center"
        justify="center"
        py="12"
        px="6"
      >
        {!isLoading && (
          <>
            <Heading
              as="h1"
              color="white"
              fontSize={{ base: 30, md: 48 }}
              fontWeight="700"
            >
              🐲 DRAGONVERSE 🐲
            </Heading>
            <Text
              mb={{ base: 2, md: 8 }}
              color="white"
              fontSize={{ base: 16, md: 20 }}
            >
              Team up to protect the DragonVerse!
            </Text>

            {renderContent()}
          </>
        )}
      </Flex>
    </Box>
  )
}
