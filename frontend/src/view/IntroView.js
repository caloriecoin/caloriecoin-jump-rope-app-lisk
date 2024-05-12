import React, { useState, useEffect} from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import * as Progress from 'react-native-progress';

import WemixLogo from '@/assets/image/wemix_logo.png';
import CalorieCoinLogo from '@/assets/image/coin_logo.png';


const IntroView = ({loading}) => {
    const [loadingText, setLoadingText] = useState('클레이튼 네트워크 연결 중 ...');
    
    useEffect(()=>{
        if(loading >= 0.3 && loading < 0.45)
        {
            setLoadingText(()=>'위믹스 데이터 연동 중 ...');
        }
        else if(loading >= 0.45 && loading < 0.55)
        {
            setLoadingText(()=>'위믹스 account 데이터 연동 중 ...');
        }
        else if(loading >= 0.55 && loading < 0.65)
        {
            setLoadingText(()=>'위믹스 contract 데이터 연동 중 ...');
        }
        else if(loading >= 0.65 && loading <= 1.0)
        {
            setLoadingText(()=>'칼로리 코인 데이터베이스 로드 중 ...');
        }
        else
        {
            setLoadingText(()=>'클레이튼 네트워크 연결 중 ...');
        }
    }, [loading]);

    return <View style={styles.container}>
        <Text style={styles.textTitleStyle}>{loadingText}</Text>
        <Text style={{color:'white', marginBottom:12}}>결과 분석 중</Text>
        <Progress.Bar progress={loading} width={310} color={'#fdca40'} height={12} borderRadius={10}/>
        <Text style={styles.textStyle}>Wemix X CalorieCoin</Text>       
        <View style={styles.imageContainer}>
            <Image source={WemixLogo} style={{width:87, height:87, marginRight:48}}/>
            <Image source={CalorieCoinLogo} style={{width:100, height: 100}}/>
        </View>
    </View>;
};

const styles = StyleSheet.create({
    container : {
        display: 'flex',
        backgroundColor:'#0C0C0C',
        flex:1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textTitleStyle: {
        fontFamily:'SUIT-Bold',
        color:'white',
        fontSize:24,
        marginBottom:100
    },
    textStyle : {
        fontFamily:'SUIT-Bold',
        color:'white',
        fontSize:24,
        marginTop:90
    },
    imageContainer: {
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        marginTop:60
    }
});

export default IntroView;