import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, BackHandler } from 'react-native';

import { useSelector } from 'react-redux';

import Sound from 'react-native-sound';

import { io } from "socket.io-client";

import LinearGradient from 'react-native-linear-gradient';

import CoinImage from '@/assets/image/coin_logo.png';

import StatusIcon from '@components/StatusBar/StatusIcon';

import Player from '@components/game/Player';
import BattleProgressBar from '@components/game/BattleProgressBar';


import Web3 from 'web3';
import {
    CalorieCoinContractABI,
    CalorieCoinContractAddress,
    CalorieCoinPrivateKey,
    CalorieCoinAddress
} from '@components/lisk/CalorieCoinConnector';
import { saveTransactionOnLocalStorage } from '@/util/CommonUtil';

Sound.setCategory('Battle');

const bleManager = global.bleManager;

const battleReadySound = new Sound('battle_ready.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
});

const battleSound = new Sound('battle.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
});

const battleOverSound = new Sound('battle_end.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
});

const battleWinSound = new Sound('battle_win.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
});

const battleDrawSound = new Sound('battle_draw.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
});

const battleLoseSound = new Sound('battle_lose.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
});

const Battle = ({ navigation }) => {

    const [gameStatus, setGameStatus] = useState('wait');  // wait, load, play, end

    const [myJump, setMyJump] = useState(0);
    const [targetJump, setTargetJump] = useState(0);

    const [modalView, setModalView] = useState(false);

    const [subTitle, setSubTitle] = useState("");
    const [mainTitle, setMainTitle] = useState("");

    const [targetInfo, setTargetInfo] = useState(null);

    const [battleResult, setBattleResult] = useState("");
    const [battleRating, setBattleRating] = useState(0);

    const [headerLeftMessage, setHeaderLeftMessage] = useState("1:1 배틀 대기중");

    const [footerMessage, setFooterMessage] = useState("");
    const [footerSecondMessage, setSecondFooterMessage] = useState("");

    const [socket, setSocket] = useState(null);

    const [currentCount, setCurrentCount] = useState(0);

    const { userInfo } = useSelector(({ user }) => ({
        userInfo: user.info,
    }));

    const { jumpData, connectedMacAddr } = useSelector(({ skipping }) => ({
        jumpData: skipping.skippingData,
        connectedMacAddr: skipping.connectedMacAddr
    }));

    const playGame = () => {
        if (connectedMacAddr)
            bleManager.startSkip(connectedMacAddr, 0, 0);
    };

    const stopGame = () => {
        if (connectedMacAddr)
            bleManager.stopSkip(connectedMacAddr);
    };

    useEffect(() => {
        if (jumpData && socket) {
            const realData = jumpData.skip_count - currentCount;

            setCurrentCount(e => e + realData);
            socket.emit('jumping', realData);
        }
    }, [jumpData]);

    useEffect(() => {
        setGameStatus('wait');
        setSubTitle("게임 서버 접속 중 ...");

        let socketClient = null;

        if (socket == null) {
            socketClient = io.connect("https://socket-battle-server.herokuapp.com", {
                transports: ["websocket"]
            });
            setSocket(socketClient);
        }

        return () => {
            socketClient.disconnect();
            battleReadySound.pause();
            battleSound.pause();
            battleOverSound.pause();
            battleWinSound.pause();
            battleDrawSound.pause();
            battleLoseSound.pause();
        };
    }, []);

    useEffect(() => {
        if (socket != null) {
            // 소켓 접속
            socket.on('connect', () => {
                // queue 참여
                setSubTitle("배틀 매치 대기 중 ...");
                setHeaderLeftMessage('1:1 배틀 매치 대기 중');

                socket.emit('enterQueue', {
                    nickname: userInfo.nickname,
                    gender: userInfo.gender,
                    id: userInfo.id
                });
            });

            // 정보 불러오기
            socket.on('LOADING_GAME', (targetInfo) => {
                // 상대 참여 완료
                setGameStatus('load');
                setSubTitle("준비 !!!");
                setMainTitle("3");

                battleReadySound.setVolume(0.8);
                battleReadySound.play();

                setTimeout(() => {
                    setMainTitle("2");
                    setTimeout(() => {
                        setMainTitle("1");
                    }, 1000);
                }, 1000);

                setHeaderLeftMessage(`${targetInfo.nickname} 님과 1:1 배틀 준비 중`)

                setTargetInfo(targetInfo);
            });

            // 게임 시작
            socket.on('START_GAME', () => {
                // 상대 참여 완료
                setGameStatus('play');
                setSubTitle("");
                setMainTitle("시작 !!");

                setHeaderLeftMessage(`${targetInfo.nickname} 님과 1:1 배틀 중`)
                playGame();

                battleSound.setVolume(0.8);
                battleSound.play();
            });

            // 게임 진행 이벤트
            socket.on('GAME_STATUS', (status) => {
                // 상대 참여 완료
                setSubTitle("");
                setMainTitle(Math.round(status.lefttime / 1000) + " s");
                setMyJump(status.myJump);
                setTargetJump(status.targetJump);
                battleSound.setVolume(0.8);
                battleSound.play();
            });

            // 게임 종료 
            socket.on('END_GAME', (result) => {
                setGameStatus('end');

                stopGame();

                battleSound.pause();
                battleOverSound.setVolume(0.8);
                battleOverSound.play();

                if (result.draw) {
                    setBattleResult("무");
                    setBattleRating("+5");

                    setTimeout(() => {
                        battleDrawSound.setVolume(0.8);
                        battleDrawSound.play();
                        setModalView(true);
                    }, 2500);
                }
                else {
                    if (result.winner === userInfo.nickname) {
                        setBattleResult("승");
                        setBattleRating("+10");

                        setTimeout(() => {
                            battleWinSound.setVolume(0.8);
                            battleWinSound.play();
                            setModalView(true);
                        }, 2500);
                    }
                    else {
                        setBattleResult("패");
                        setBattleRating("-10");

                        setTimeout(() => {
                            battleLoseSound.setVolume(0.8);
                            battleLoseSound.play();
                            setModalView(true);
                        }, 2500);
                    }
                }

                socket.disconnect();
            });
        }
    }, [socket]);

    const transferCoin = async () => {

        const web3 = new Web3(new Web3.providers.HttpProvider('https://rpc.sepolia-api.lisk.com/'));

        const calorieCoinContract = new web3.eth.Contract(CalorieCoinContractABI, CalorieCoinContractAddress);

        const transferData = calorieCoinContract.methods.transfer(walletInfo.address, 10000000).encodeABI();

        const accountTransactionNumber = await web3.eth.getTransactionCount(CalorieCoinAddress, 'latest');

        const rawTransaction = {
            nonce: web3.utils.toHex(accountTransactionNumber),
            gasPrice: 25000000000,
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

    return <View style={styles.container}>
        <View style={{ flexDirection: 'row', width: '100%', position: 'absolute', zIndex: 999, top: 0 }}>
            <View style={styles.headerLeft}>
                <Text style={{ color: "white", fontFamily: 'SUIT-SemiBold', fontSize: 16 }}>{headerLeftMessage}</Text>
            </View>
            <View style={styles.headerRight}>
                <StatusIcon />
            </View>
        </View>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalView}
        >
            <TouchableOpacity style={{ backgroundColor: '#00000088', flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => {
                battleReadySound.pause();
                battleSound.pause();
                battleOverSound.pause();
                battleWinSound.pause();
                battleDrawSound.pause();
                battleLoseSound.pause();

                navigation.goBack();
            }}>
                <View style={{ padding: 24, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: 17, width: '85%' }}>
                    <Text style={{ fontFamily: 'SUIT-ExtraBold', fontSize: 24 }}>게임 결과</Text>
                    <View style={{ flexDirection: 'row', marginTop: 24 }}>
                        <Text style={{ fontFamily: 'SUIT-SemiBold', fontSize: 24 }}>레이팅 : </Text>
                        <Text style={{ fontFamily: 'SUIT-ExtraBold', fontSize: 28 }}>{battleRating}</Text>
                    </View>
                    <View style={{ backgroundColor: '#f1f1f5', justifyContent: 'center', alignItems: 'center', padding: 36, borderRadius: 12, marginTop: 18 }}>
                        <Text style={{ fontFamily: 'SUIT-ExtraBold', fontSize: 72 }}>{battleResult}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontFamily: 'SUIT-Heavy', fontSize: 48, color: '#fc5a5a', marginRight: 8 }}>{myJump}</Text>
                            <Text style={{ fontFamily: 'SUIT-Heavy', fontSize: 48, color: '#44444f' }}>:</Text>
                            <Text style={{ fontFamily: 'SUIT-Heavy', fontSize: 48, color: '#005fff', marginLeft: 8 }}>{targetJump}</Text>
                        </View>
                    </View>

                    <Text style={{ marginTop: 28, textAlign: 'center', fontFamily: 'SUIT-Regular', fontSize: 14 }}>아무 곳이나 터치하면 창이 닫힙니다.</Text>
                </View>
            </TouchableOpacity>
        </Modal>
        <LinearGradient colors={['#e1963b', '#f33639', '#e93e5c']} locations={[0, 0.35, 1]} style={styles.sky}>
            <View style={{ flex: 1, justifyContent: 'flex-start', marginTop: 64, alignItems: 'center' }}>
                <View style={styles.priceBox}>
                    <Text style={{ fontFamily: 'SUIT-SemiBold', fontSize: 14, color: 'white' }}>상금 :</Text>
                    <Image source={CoinImage} style={{ width: 32, height: 32, marginLeft: 8 }} />
                    <Text style={{ fontFamily: 'SUIT-Bold', fontSize: 24, color: 'white', marginLeft: 4 }}>320</Text>
                </View>
                <Text style={styles.loading}>{subTitle}</Text>
                <Text style={styles.count}>{mainTitle}</Text>
            </View>
        </LinearGradient>
        <LinearGradient colors={['#2c1b2b', '#464652']} style={styles.ground}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                <View style={{ top: 0, marginTop: -350, left: 0 }}>
                    <Player nickname={userInfo.nickname} gender={userInfo.gender} subtitle="나" isPlay={gameStatus === 'play'} />
                </View>
                <View style={{ top: 0, marginTop: -350, marginLeft: 30 }}>
                    <Player nickname={targetInfo != null ? targetInfo.nickname : ''} gender={targetInfo != null ? targetInfo.gender : ''} subtitle="상대" disabled={targetInfo === null ? true : false} isPlay={gameStatus === 'play'} />
                </View>
            </View>
            {gameStatus === 'play' && <BattleProgressBar myScore={myJump} targetScore={targetJump} />}
            <View style={{ width: '100%', position: 'absolute', zIndex: 999, bottom: 0 }}>
                <Text style={{ fontFamily: 'SUIT-Medium', color: 'white', textAlign: 'center', marginBottom: 10, fontSize: 12, }}>{footerMessage}</Text>
                <Text style={{ fontFamily: 'SUIT-Medium', color: 'white', textAlign: 'center', marginBottom: 18, fontSize: 12, }}>{footerSecondMessage}</Text>
            </View>
        </LinearGradient>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sky: {
        flex: 1.4,
        width: '100%'
    },
    ground: {
        flex: 1,
        width: '100%'
    },
    headerLeft: {
        marginRight: 'auto',
        color: 'white',
        margin: 14,
    },
    headerRight: {
        marginLeft: 'auto',
        color: 'white',
        margin: 8
    },
    priceBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#171725',
        padding: 18,
        width: '75%',
        borderRadius: 14
    },
    loading: {
        fontFamily: 'SUIT-SemiBold',
        fontSize: 24,
        color: 'white',
        marginTop: 28
    },
    count: {
        fontFamily: 'SUIT-SemiBold',
        fontSize: 64,
        color: 'white',
        marginTop: 12
    },
});

export default Battle;