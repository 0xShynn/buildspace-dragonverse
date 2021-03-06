import { useState, useEffect } from 'react'

import {
  Box,
  Button,
  CircularProgress,
  Flex,
  Stack,
  Text,
} from '@chakra-ui/react'
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
      alert(
        `Your attack succeeded!\nBoss: ${bossHp} HP\nPlayer: ${playerHp} HP`
      )

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
    <Flex maxW="1110px" w="full" align="center" direction="column">
      <Stack
        w="full"
        align="center"
        spacing={{ base: 4, md: 10 }}
        justify="center"
        direction={{ base: 'column', md: 'row' }}
        mb={{ base: 4, md: 8 }}
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
            attackDmg={characterNFT.attackDamage}
            type="player"
            banner={true}
          />
        )}

        <Box>
          <Text
            color="white"
            fontSize="36px"
            fontWeight="bold"
            fontFamily="heading"
          >
            Vs
          </Text>
        </Box>

        {boss && (
          <CharacterCard
            name={boss.name}
            hp={boss.hp}
            maxHp={boss.maxHp}
            image="/assets/super-saiyan-rose.jpg"
            attackDmg={boss.attackDamage}
            type="boss"
            banner={true}
          />
        )}
      </Stack>
      {boss && (
        <Button
          px={attackState === 'Attacking' ? 10 : 16}
          py="8"
          bg="#2D65C6"
          color="white"
          onClick={runAttackAction}
          fontSize="20px"
          rounded="md"
          _hover={{ bg: '#16307D' }}
        >
          {attackState === 'Attacking' ? (
            <span>
              <CircularProgress
                isIndeterminate
                color="green.300"
                mr="3"
                size="8"
              />
              Attacking the Boss...
            </span>
          ) : (
            'Attack the Boss!'
          )}
        </Button>
      )}
    </Flex>
  )
}

export default Arena
