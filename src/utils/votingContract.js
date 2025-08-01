import { ethers } from 'ethers'
import VotingABI from '../contracts/VotingABI.json' // 合约ABI

const CONTRACT_ADDRESS = "0x..." // 合约地址

export async function getContract() {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  return new ethers.Contract(CONTRACT_ADDRESS, VotingABI, signer)
}

export async function getAllThemes() {
  const contract = await getContract()
  const ids = await contract.getAllThemeIds()
  
  const themes = []
  for (const id of ids) {
    const theme = await contract.getThemeById(id)
    themes.push({
      id: theme.t_id.toString(),
      name: theme.t_name,
      description: theme.t_description,
      startTime: theme.t_start_time.toNumber(),
      endTime: theme.t_end_time.toNumber(),
      isActive: theme.isActive
    })
  }
  return themes
}

export async function getThemeDetails(id) {
  const contract = await getContract()
  const theme = await contract.getThemeById(id)
  const candidates = await contract.getVotingResult(id)
  
  return {
    id: theme.t_id.toString(),
    name: theme.t_name,
    description: theme.t_description,
    startTime: theme.t_start_time.toNumber(),
    endTime: theme.t_end_time.toNumber(),
    isActive: theme.isActive,
    candidates: candidates.map(c => ({
      id: c.c_id.toString(),
      name: c.c_name,
      voteCount: c.c_vote_count.toString()
    }))
  }
}

export async function createVoting(topicData) {
  const contract = await getContract()
  const tx = await contract.createVoting(
    topicData.name,
    topicData.description,
    Math.floor(topicData.startTime / 1000), // JS时间戳转秒
    Math.floor(topicData.endTime / 1000),
    topicData.candidates
  )
  await tx.wait()
}

export async function vote(themeId, candidateId) {
  const contract = await getContract()
  const tx = await contract.vote(themeId, candidateId)
  await tx.wait()
}