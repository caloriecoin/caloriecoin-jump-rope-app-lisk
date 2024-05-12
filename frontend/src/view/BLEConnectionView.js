import React from 'react';
import {useDispatch} from 'react-redux';

import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';

import {
    setConnectedDeviceAddr,
    setSkippingConnection
} from '@redux/Skipping';

import {useSelector} from 'react-redux';

import BackIcon from '@/assets/icon/back.svg';

const BLEconnectionView = ({navigation}) =>{ 
    const {connection, connectedMacAddr, deviceList} = useSelector(({skipping}) => ({
        connection: skipping.connection,
        connectedMacAddr: skipping.connectedMacAddr,
        deviceList: skipping.deviceList
    }));
    
    const dispatch = useDispatch();

    return <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fff'}}>
        <TouchableOpacity onPress={()=>{navigation.goBack()}} style={{marginRight:'auto'}}>
            <BackIcon width={32} height={32} style={{margin:16}}/>
        </TouchableOpacity>
        {connection === 'connect' && <TouchableOpacity style={styles.connect} onPress={()=>{dispatch(setSkippingConnection('disconnect'));}}>
            <Text style={{fontSize:18,margin:24, color:'white', fontFamily:'SUIT-Bold'}}>기기 연결 됨 <Text style={{fontSize:14, fontFamily:'SUIT-SemiBold'}}>({connectedMacAddr})</Text></Text>
            <Text style={{fontSize:14, marginTop:4, marginBottom:26, color:'white', fontFamily:'SUIT-Bold'}}>터치 시 연결이 해제 됩니다.</Text>
        </TouchableOpacity>}
        {connection === 'disconnect' && <TouchableOpacity style={styles.disconnect} disabled={true}> 
            <Text style={{fontSize:18,margin:24, color:'white'}}>연결 해제</Text>
        </TouchableOpacity>}
        {connection === 'connecting' && <TouchableOpacity style={styles.connecting} disabled={true}> 
            <Text style={{fontSize:18,margin:24, color:'white'}}>기기 연결 대기 중</Text>
        </TouchableOpacity>}
        <Text style={{fontFamily:'SUIT-Bold', fontSize:24}}>기기 목록</Text>
        <Text style={{fontFamily:'SUIT-Regular', marginTop:8}}>기기 목록이 보이지 않는다면</Text>
        <Text style={{fontFamily:'SUIT-Regular', marginTop:8}}>앱 설정 > 권한 > 위치 권한을 확인해주세요 !!</Text>
        <FlatList
            data={deviceList}
            renderItem={({item})=>{return <TouchableOpacity 
            style={{justifyContent:'center', alignItems:'center', backgroundColor:'#f1f1f5', borderRadius:24, marginTop:22}}
            onPress={()=>{
                dispatch(setConnectedDeviceAddr(item.macAddr));
            }}>
                <Text style={{fontSize:18,margin:24}}>{item.name} ({item.macAddr})</Text>
            </TouchableOpacity>}}
            keyExtractor={(item,index)=> String(index)}
            style={{width:'85%'}}
        />
    </View>
};

const styles = StyleSheet.create({
    connect:{
        width:'85%',
        justifyContent:'center', 
        alignItems:'center', 
        backgroundColor:'#3dd598',
        borderRadius:24, 
        marginBottom:24
    },
    disconnect:{
        width:'85%',
        justifyContent:'center', 
        alignItems:'center', 
        backgroundColor:'#FF3348', 
        borderRadius:24, 
        marginBottom:24
    },
    connecting:{
        width:'85%',
        justifyContent:'center', 
        alignItems:'center', 
        backgroundColor:'#fcba03', 
        borderRadius:24, 
        marginBottom:24
    }
});

export default BLEconnectionView;