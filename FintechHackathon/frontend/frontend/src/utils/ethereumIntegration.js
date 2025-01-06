// src/utils/ethereumIntegration.js

import { Contract, Web3Provider, formatEther, parseEther } from 'ethers';
import CarbonCreditTokenABI from '../contracts/CarbonCreditTokenABI.json';

// Load environment variables from .env
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const EVM_RPC_URL = process.env.REACT_APP_EVM_RPC_URL;

// Initialize provider and signer
const provider = new Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Initialize contract instance
const contract = new Contract(CONTRACT_ADDRESS, CarbonCreditTokenABI, signer);

/**
 * Fetches the token balance of a specific address.
 * @param {string} address - The Ethereum address.
 * @returns {string} - The token balance formatted in Ether.
 */
export const getTokenBalance = async (address) => {
  try {
    const balance = await contract.balanceOf(address);
    return formatEther(balance);
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return '0';
  }
};

/**
 * Lists tokens for sale.
 * @param {string} amount - The amount of tokens to list.
 * @param {string} pricePerToken - The price per token in ETH.
 */
export const listTokens = async (amount, pricePerToken) => {
  try {
    const tx = await contract.listTokens(
      parseEther(amount),
      parseEther(pricePerToken)
    );
    await tx.wait();
  } catch (error) {
    console.error('Error listing tokens:', error);
    throw error;
  }
};

/**
 * Buys tokens from a specific listing.
 * @param {number} listingId - The ID of the listing.
 * @param {string} ethAmount - The amount of ETH to send.
 */
export const buyTokens = async (listingId, ethAmount) => {
  try {
    const tx = await contract.buyTokens(listingId, {
      value: parseEther(ethAmount),
    });
    await tx.wait();
  } catch (error) {
    console.error('Error buying tokens:', error);
    throw error;
  }
};

/**
 * Fetches all active listings.
 * @returns {Array} - List of active listings.
 */
export const fetchListings = async () => {
  try {
    const nextId = await contract.nextListingId();
    const listings = [];

    for (let id = 1; id < nextId; id++) {
      const listing = await contract.listings(id);
      if (listing.active) {
        listings.push({
          id: id.toNumber(),
          amount: formatEther(listing.amount),
          pricePerToken: formatEther(listing.pricePerToken),
          seller: listing.seller,
        });
      }
    }

    return listings;
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
};
