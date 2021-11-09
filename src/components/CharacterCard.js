import {
  Box,
  Flex,
  Heading,
  Progress,
  ProgressLabel,
  Text,
} from '@chakra-ui/react'
import NextImage from 'next/image'

const CharacterCard = ({ name, image, hp, maxHp, type, children }) => {
  return (
    <Flex
      justify="center"
      direction="column"
      maxW="300px"
      w="full"
      align="center"
      bg={type === 'boss' ? 'purple.800' : 'orange.300'}
      p="4"
      rounded="md"
      borderWidth="4px"
      borderColor={type === 'boss' ? 'purple.500' : 'orange.500'}
    >
      <Box color="white" textAlign="center">
        <Text>{type === 'boss' ? 'Boss card' : 'Player card'}</Text>
        <Heading as="h3" mb="2" fontSize="20px">
          {name}
        </Heading>
      </Box>
      <Box h="300px" w="full" pos="relative" roundedTop="lg" overflow="hidden">
        <NextImage
          src={
            type === 'boss'
              ? image
              : `https://cloudflare-ipfs.com/ipfs/${image}`
          }
          alt={name}
          layout="fill"
          objectFit="cover"
        />
      </Box>
      <Progress
        size="lg"
        value={hp}
        max={maxHp}
        colorScheme="green"
        roundedBottom="lg"
        height="6"
        w="full"
      >
        <ProgressLabel textAlign="right" pr="4">
          <Text fontSize="14px" color="red">
            {hp} / {maxHp} HP{' '}
          </Text>
        </ProgressLabel>
      </Progress>
      {children}
    </Flex>
  )
}

export default CharacterCard
