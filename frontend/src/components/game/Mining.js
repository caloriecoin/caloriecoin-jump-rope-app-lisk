import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import axios from 'axios';

import Sound from 'react-native-sound';

import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import CoinImage from '@/assets/image/coin_logo.png';

import Web3 from 'web3';
import {
    CalorieCoinContractABI,
    CalorieCoinContractAddress,
    CalorieCoinPrivateKey,
    CalorieCoinAddress
} from '@components/lisk/CalorieCoinConnector'

import RopeIcon from '@/assets/icon/rope.svg';
import BackIcon from '@/assets/icon/back.svg';

import { getSecondToString, saveTransactionOnLocalStorage } from '@/util/CommonUtil';

import Coin from '@components/game/Coin';

const bleManager = global.bleManager;

Sound.setCategory('Mining');

const overMiningSound = new Sound('mining_over.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
});

const getCoinSound = new Sound('get_coin.wav', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
});

const startBackgroundSound = new Sound('mining_background.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
});

const Mining = ({ navigation }) => {

    const [jumpCount, setJumpCount] = useState(0);
    const [currentCount, setCurrentCount] = useState(0);

    const [jumpingTotalCount, setJumpingTotalCount] = useState(0);
    const [totalCalorie, setTotalCalorie] = useState(0);
    const [totalTime, setTotalTime] = useState(0);

    const [earnedToken, setEarnedToken] = useState(0);

    const [balance, setBalance] = useState(0);

    const [modalView, setModalView] = useState(false);

    const [isPlay, setIsPlay] = useState(false);

    const [showEffect, setShowEffect] = useState(false);

    const { connection, jumpData, connectedMacAddr } = useSelector(({ skipping }) => ({
        connection: skipping.connection,
        jumpData: skipping.skippingData,
        connectedMacAddr: skipping.connectedMacAddr
    }));

    const { userInfo, walletInfo } = useSelector(({ user }) => ({
        userInfo: user.info,
        walletInfo: user.wallet
    }));

    const playGame = () => {
        startBackgroundSound.setVolume(0.8);
        startBackgroundSound.play();

        setEarnedToken(0);

        if (connectedMacAddr)
            bleManager.startSkip(connectedMacAddr, 0, 0, (data) => {
                console.log(data);
                setIsPlay(true);
            });
    };

    const stopGame = () => {
        if (connectedMacAddr)
            bleManager.stopSkip(connectedMacAddr);
    };

    const handlePlay = () => {
        if (connectedMacAddr) {
            if (isPlay) stopGame();
            else playGame();
        }
    };

    const transferCoin = async () => {

        const web3 = new Web3(new Web3.providers.HttpProvider('https://rpc.sepolia-api.lisk.com/'));

        const calorieCoinContract = new web3.eth.Contract(CalorieCoinContractABI, CalorieCoinContractAddress);

        const transferData = calorieCoinContract.methods.transfer(walletInfo.address, 10000000).encodeABI();

        const accountTransactionNumber = await web3.eth.getTransactionCount(CalorieCoinAddress, 'latest');

        const networkGasPrice = await web3.eth.getGasPrice();

        console.log('networkGasPrice >> ', networkGasPrice);

        const rawTransaction = {
            nonce: web3.utils.toHex(accountTransactionNumber),
            gasPrice: networkGasPrice,
            gasLimit: web3.utils.toHex(3000000),
            to: CalorieCoinContractAddress,
            value: 0,
            data: transferData
        }

        const signedTx = await web3.eth.accounts.signTransaction(rawTransaction, CalorieCoinPrivateKey);

        web3.eth.sendSignedTransaction(signedTx.rawTransaction).on('confirmation', async (confirmationNumber, receipt) => {

            if (confirmationNumber == 3) {
                saveTransactionOnLocalStorage(receipt);

                const balance = await calorieCoinContract.methods.balanceOf(walletInfo.address).call();

                setBalance(web3.utils.fromWei(balance, 'mwei'));

                // get coin effect & sound
                setShowEffect(true);

                getCoinSound.setVolume(1.0);
                getCoinSound.play();
            }
            else if (confirmationNumber == 5) {
                setShowEffect(false);
            }
        });
    }

    useEffect(async () => {

        const web3 = new Web3(
            new Web3.providers.HttpProvider('https://rpc.sepolia-api.lisk.com/'),
        );

        const calorieCoinContract = new web3.eth.Contract(CalorieCoinContractABI, CalorieCoinContractAddress);

        const balance = await calorieCoinContract.methods.balanceOf(walletInfo.address).call();

        setBalance(web3.utils.fromWei(balance, 'mwei'));

        setJumpCount(0);

        return () => {
            console.log('end mining');
            overMiningSound.release();
            getCoinSound.release();
            startBackgroundSound.release();
        };
    }, []);

    useEffect(() => {
        if (jumpData.isStabilized) {
            if (isPlay) {
                // give 보상
                startBackgroundSound.pause();

                overMiningSound.setVolume(1);
                overMiningSound.play();

                axios.post(`https://caloriecoin.herokuapp.com/api/minningJump/createOneUserOneMinningJump/${userInfo.id}`, {
                    jumps: jumpData.skip_count,
                    mined_caloriecoins: earnedToken,
                    duration_time: jumpData.elapsed_time,
                    burned_kcalories: jumpData.calories_burned
                }).then(response => {
                    setCurrentCount(0);
                    setJumpCount(0);

                    setJumpingTotalCount(jumpData.skip_count);
                    setTotalCalorie(jumpData.calories_burned);
                    setTotalTime(jumpData.elapsed_time);

                    AsyncStorage.setItem('client::jumpCount', JSON.stringify({ count: jumpCount }));

                    setModalView(true);
                    setIsPlay(false);
                });
            }
        }
        else {
            if (isPlay) {
                const realData = jumpData.skip_count - currentCount;

                if (realData != NaN) {
                    const updateData = jumpCount + realData;

                    if ((updateData >= 98) && (updateData % 100 >= 0) && (updateData % 100 < 5)) {
                        transferCoin();
                        setEarnedToken(e => e + 10);
                        setJumpCount(updateData);
                    }
                    else {
                        setCurrentCount(jumpData.skip_count);
                        setJumpCount((updateData));
                    }
                }
            }
        }
    }, [jumpData]);

    useEffect(() => {
        console.log('connectedMacAddr >> ', connectedMacAddr);
    }, [connectedMacAddr]);

    useEffect(() => {
        console.log('connection >> ', connection);
    }, [connectedMacAddr]);


    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalView}
        >
            <TouchableOpacity style={{ backgroundColor: '#00000088', flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => {
                setModalView(false);
            }}>
                <View style={{ padding: 24, backgroundColor: '#fff', borderRadius: 17, width: '85%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RopeIcon height={36} width={36} />
                        <Text style={styles.value}>운동 결과</Text>
                    </View>
                    <Text style={styles.modalText}>줄넘기 횟수: {jumpingTotalCount} 회</Text>
                    <Text style={styles.modalText}>소모 칼로리 량: {totalCalorie} Kcal</Text>
                    <Text style={styles.modalText}>운동 시간: {getSecondToString(totalTime)}</Text>
                    <Text style={styles.modalText}>획득 칼로리 코인: {earnedToken}</Text>
                    <Text style={{ marginTop: 28, textAlign: 'center', fontFamily: 'SUIT-Regular', fontSize: 14 }}>아무 곳이나 터치하면 창이 닫힙니다.</Text>
                </View>
            </TouchableOpacity>
        </Modal>
        <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ marginRight: 'auto' }}>
            <BackIcon width={32} height={32} style={{ margin: 16 }} />
        </TouchableOpacity>
        <View style={styles.top}>
            <Text style={{ fontFamily: 'SUIT-SemiBold', fontSize: 16 }}>보유 칼로리 코인 : </Text>
            <Image source={CoinImage} style={{ width: 18, height: 18 }} />
            <Text style={styles.value}>{balance}</Text>
        </View>
        <View style={styles.container}>
            <Text style={{ fontFamily: 'SUIT-SemiBold', fontSize: 16 }}>총 줄넘기 횟수</Text>
            <Text style={jumpCount === -1 ? styles.loadingText : styles.countText}>{jumpCount === -1 ? '줄넘기 재 연결 중...' : jumpCount}</Text>
        </View>
        <TouchableOpacity onPress={() => {
            handlePlay();
        }}>
            {connection == 'connect' && <Text style={isPlay ? styles.stop : styles.play}>{isPlay ? '멈춤' : '시작'}</Text>}
            {connection == 'connecting' && <Text style={styles.connecting}>기기 연결 대기 중 ...</Text>}
        </TouchableOpacity>
        {jumpCount >= 0 &&
            <View style={styles.footer}>
                <Text><Text style={{ color: '#3dd598', fontFamily: 'SUIT-Bold', fontSize: 32 }}>{100 - (jumpCount % 100)}회</Text>   <Text style={{ color: 'white', fontFamily: 'SUIT-Regular', fontSize: 16, marginLeft: 12 }}>추가 후</Text></Text>
                <Text style={{ marginTop: 8 }}><Image source={CoinImage} style={{ height: 16, width: 16 }} />  <Text style={{ color: 'white', fontFamily: 'SUIT-Bold', fontSize: 16 }}>10 칼로리코인</Text> <Text style={{ color: 'white', fontFamily: 'SUIT-Regular', fontSize: 16, marginLeft: 12 }}>획득 가능</Text></Text>
            </View>
        }
        {showEffect && <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
            <Coin />
            <Coin />
            <Coin />
            <Coin />
            <Coin />
            <Coin />
            <Coin />
            <Coin />
            <Coin />
            <Coin />
        </View>}
    </View>
}

const styles = StyleSheet.create({
    top: {
        flex: 0.3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f1f1f5',
        padding: 18,
        paddingLeft: 48,
        paddingRight: 48,
        borderRadius: 12,
        margin: 24,
    },
    play: { fontFamily: 'SUIT-Regular', fontSize: 18, padding: 24, paddingTop: 12, paddingBottom: 12, backgroundColor: '#3dd598', color: 'white', borderRadius: 10 },
    stop: { fontFamily: 'SUIT-Regular', fontSize: 18, padding: 24, paddingTop: 12, paddingBottom: 12, backgroundColor: '#FF3348', color: 'white', borderRadius: 10 },
    connecting: { fontFamily: 'SUIT-Regular', fontSize: 18, padding: 24, paddingTop: 12, paddingBottom: 12, backgroundColor: '#c77d38', color: 'white', borderRadius: 10 },
    loadingText: {
        fontFamily: 'SUIT-ExtraBold',
        fontSize: 36,
        color: '#171726',
        marginTop: 12
    },
    countText: {
        fontFamily: 'SUIT-ExtraBold',
        fontSize: 72,
        color: '#171726',
        marginTop: 12
    },
    value: {
        fontFamily: 'SUIT-ExtraBold',
        fontSize: 24,
        marginLeft: 4
    },
    container: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        backgroundColor: '#171725',
        width: 240,
        borderRadius: 12,
        margin: 24
    },
    modalText: {
        marginTop: 18,
        fontFamily: 'SUIT-SemiBold',
        fontSize: 18
    }
});

export default Mining;