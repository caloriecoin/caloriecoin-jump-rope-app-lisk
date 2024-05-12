import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Modal, Linking } from 'react-native';

import CoinImage from '@/assets/image/coin_logo.png';

import BackIcon from '@/assets/icon/back.svg';

import Web3 from 'web3';
import { CalorieCoinContractABI, CalorieCoinContractAddress } from '@components/lisk/CalorieCoinConnector'

import { commaText } from '@/util/CommonUtil';

import AsyncStorage from '@react-native-async-storage/async-storage';

const WalletView = ({ navigation }) => {

    const [balance, setBalance] = useState(0);
    const [txList, setTxList] = useState([]);

    const [modalView, setModalView] = useState(false);
    const [currentTx, setCurrentTx] = useState(null);

    const web3 = new Web3(
        new Web3.providers.HttpProvider('https://rpc.sepolia-api.lisk.com/'),
    );

    const { walletInfo } = useSelector(({ user }) => ({
        walletInfo: user.wallet
    }));

    const handleWithdraw = async () => {
        const calorieCoinContract = new web3.eth.Contract(CalorieCoinContractABI, CalorieCoinContractAddress);

        const balance = await calorieCoinContract.methods.balanceOf(walletInfo.address).call();

        setBalance(web3.utils.fromWei(balance, 'mwei'));
    };

    useEffect(async () => {
        const calorieCoinContract = new web3.eth.Contract(CalorieCoinContractABI, CalorieCoinContractAddress);

        const balance = await calorieCoinContract.methods.balanceOf(walletInfo.address).call();

        setBalance(web3.utils.fromWei(balance, 'mwei'));

        const data = await AsyncStorage.getItem('transactionList');

        const jsonData = JSON.parse(data);

        console.log(jsonData.transactionList);

        if (jsonData?.transactionList?.length > 0) {
            setTxList(jsonData.transactionList);
        }

    }, []);

    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalView}
        >
            <TouchableOpacity style={{ backgroundColor: '#00000088', flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => {
                setModalView(false);
            }}>
                <View style={{ padding: 24, backgroundColor: '#fff', borderRadius: 17, width: '85%' }}>
                    <Text style={{ fontFamily: 'SUIT-ExtraBold', fontSize: 24, textAlign: 'center', marginBottom: 16 }}>트랜잭션 상세 정보</Text>

                    <Text style={{ fontFamily: 'SUIT-Regular', fontSize: 16, color: '#888' }}>블록 높이</Text>
                    <Text style={{ fontFamily: 'SUIT-Regular', fontSize: 16 }}># {currentTx && currentTx.blockNumber}</Text>

                    <Text style={{ fontFamily: 'SUIT-Regular', fontSize: 16, color: '#888', marginTop: 16 }}>칼로리 코인 팀 주소</Text>
                    <Text numberOfLines={1} style={{ fontFamily: 'SUIT-Regular', fontSize: 16, width: '90%' }}>{currentTx && currentTx.from}</Text>

                    <Text style={{ fontFamily: 'SUIT-Regular', fontSize: 16, color: '#888', marginTop: 16 }}>내 주소</Text>
                    <Text numberOfLines={1} style={{ fontFamily: 'SUIT-Regular', fontSize: 16, width: '90%' }}>{currentTx && currentTx.to}</Text>

                    <Text style={{ fontFamily: 'SUIT-Regular', fontSize: 16, color: '#888', marginTop: 16 }}>네트워크 수수료</Text>
                    <View style={{ backgroundColor: '#eee', borderRadius: 14, padding: 8, marginTop: 8, marginBottom: 8 }}>
                        <View style={{ flexDirection: 'row', marginBottom: 8, marginTop: 8 }}>
                            <Text style={{ fontFamily: 'SUIT-Regular', marginRight: 'auto' }}>최대 가스</Text>
                            <Text style={{ fontFamily: 'SUIT-Bold', marginLeft: 'auto' }}>{currentTx && commaText(web3.utils.hexToNumber(currentTx.gas))}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                            <Text style={{ fontFamily: 'SUIT-Regular', marginRight: 'auto' }}>가스 가격</Text>
                            <Text style={{ fontFamily: 'SUIT-Bold', marginLeft: 'auto' }}>{currentTx && web3.utils.fromWei(web3.utils.hexToNumberString(currentTx.gasPrice), 'gwei')} <Text style={{ color: '#999' }}>STON</Text></Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                            <Text style={{ fontFamily: 'SUIT-Regular', marginRight: 'auto' }}>사용된 가스</Text>
                            <Text style={{ fontFamily: 'SUIT-Bold', marginLeft: 'auto' }}>{currentTx && commaText(currentTx.gasUsed)}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                            <Text style={{ fontFamily: 'SUIT-Regular', marginRight: 'auto' }}>거래 수수료</Text>
                            <Text style={{ fontFamily: 'SUIT-Bold', marginLeft: 'auto' }}>{currentTx && web3.utils.fromWei(web3.utils.hexToNumberString(currentTx.gasUsed * currentTx.gasPrice), 'ether')} <Text style={{ color: '#999' }}>KLAY</Text></Text>
                        </View>
                    </View>

                    <Text style={{ marginTop: 6, fontFamily: 'SUIT-Bold', fontSize: 12 }}>트랜잭션 수수료는 칼로리코인 팀에서 부담합니다.</Text>
                    {currentTx && <TouchableOpacity style={{ marginTop: 18 }} onPress={() => { Linking.openURL(`https://sepolia-blockscout.lisk.com/tx/${currentTx.transactionHash}`) }}>
                        <Text style={{ padding: 12, textAlign: 'center', fontFamily: 'SUIT-Bold', backgroundColor: '#585C8A', borderRadius: 8, color: 'white' }}>Lisk BlockScout에서 보기</Text>
                    </TouchableOpacity>}

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
        <Text style={{ fontFamily: 'SUIT-Bold', fontSize: 22, color: 'black' }}>트랜잭션 목록</Text>
        <FlatList
            data={txList}
            renderItem={({ item }) => {
                return <TouchableOpacity
                    style={{
                        backgroundColor: '#f1f1f5',
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 18,
                        margin: 12,
                        borderRadius: 14
                    }}
                    onPress={() => {
                        setModalView(true);
                        setCurrentTx(item);
                    }}
                >
                    <View style={{ marginRight: 'auto' }}>
                        <Text style={{ marginRight: 'auto', fontFamily: 'SUIT-Bold' }}># {item.blockNumber}</Text>
                        <Text numberOfLines={1} style={{ width: '35%', fontFamily: 'SUIT-Regular', marginTop: 8 }}>Tx Hash | {item.transactionHash}</Text>
                    </View>
                    <View style={{ marginLeft: 'auto' }}>
                        <Text style={{ fontFamily: 'SUIT-Bold', fontSize: 24 }}>+ 10</Text>
                    </View>
                </TouchableOpacity>
            }}
            style={{ marginTop: 14, width: '85%' }}
            keyExtractor={(item) => item.blockHash}
        />
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.withdrawButton} onPress={() => { handleWithdraw(); }}>
                <Text style={{ fontFamily: 'SUIT-Regular', fontSize: 18, color: 'white' }}>출금 하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shopButton} onPress={() => { Linking.openURL(`https://youtu.be/BYoTXNXvmpc`) }}>
                <Text style={{ fontFamily: 'SUIT-Regular', fontSize: 18, color: 'white' }}>상점 가기</Text>
            </TouchableOpacity>
        </View>
    </View>
}

const styles = StyleSheet.create({
    withdrawButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fcba03',
        borderRadius: 12,
        margin: 24,
    },
    shopButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#FF3348',
        borderRadius: 12,
        margin: 24,
    },
    top: {
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
    value: {
        fontFamily: 'SUIT-ExtraBold',
        fontSize: 24,
        marginLeft: 4
    },
});

export default WalletView;