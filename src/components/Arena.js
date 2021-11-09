import { useState, useEffect } from 'react'

import { Box, Button, Flex, Stack, Text, VStack } from '@chakra-ui/react'
import { ethers } from 'ethers'

import { CONTRACT_ADDRESS, transformCharacterData } from '../constants'
import myEpicGame from '../utils/MyEpicGame.json'

import CharacterCard from './CharacterCard'

const Arena = ({ characterNFT, setCharacterNFT }) => {
  const [gameContract, setGameContract] = useState(null)
  const [boss, setBoss] = useState(null)
  const [attackState, setAttackState] = useState('')

  const runAttackAction = async () => {
    try {
      if (gameContract) {
        setAttackState('Attacking')
        console.log('Attacking boss...')
        const attackTxn = await gameContract.attackBoss()
        await attackTxn.wait()
        console.log('attackTxn: ', attackTxn)
        setAttackState('Hit')
      }
    } catch (error) {
      console.error('Error attacking boss: ', error)
      setAttackState('')
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
      console.log('Ethereum object not found.')
    }
  }, [])

  useEffect(() => {
    const fetchBoss = async () => {
      const bossTxn = await gameContract.getBigBoss()
      console.log('Boss: ', bossTxn)
      setBoss(transformCharacterData(bossTxn))
    }

    // Setup logic when this event is fired off
    const onAttackComplete = (newBossHp, newPlayerHp) => {
      const bossHp = newBossHp.toNumber()
      const playerHp = newPlayerHp.toNumber()

      console.log(`AttackComplete: Boss Hp: ${bossHp} - Player Hp: ${playerHp}`)

      setBoss((prevState) => {
        return { ...prevState, hp: bossHp }
      })

      setCharacterNFT((prevState) => {
        return { ...prevState, hp: playerHp }
      })
    }

    if (gameContract) {
      fetchBoss()
      gameContract.on('AttackComplete', onAttackComplete)
    }

    return () => {
      if (gameContract) {
        gameContract.off('AttackComplete', onAttackComplete)
      }
    }
  }, [gameContract, setCharacterNFT])

  return (
    <Flex maxW="1110px" w="full" direction="column" align="center">
      <Stack
        w="full"
        align="center"
        spacing="10"
        justify="center"
        direction="row"
        mb="12"
        bg="blue.800"
        maxW="800px"
        p="10"
        rounded="md"
      >
        {characterNFT && (
          <CharacterCard
            name={characterNFT.name}
            hp={characterNFT.hp}
            maxHp={characterNFT.maxHp}
            image={characterNFT.imageURI}
            type="player"
          />
        )}

        <Box>
          <Text color="white" fontSize="36px" fontWeight="bold">
            Vs
          </Text>
        </Box>

        {boss && (
          <CharacterCard
            name={boss.name}
            hp={boss.hp}
            maxHp={boss.maxHp}
            image={boss.imageURI}
            type="boss"
          />
        )}
      </Stack>
      <Button
        px="16"
        py="8"
        colorScheme="blue"
        onClick={runAttackAction}
        rounded="md"
        fontSize="20px"
      >
        Attack {boss.name} !
      </Button>
    </Flex>
  )
}

export default Arena
