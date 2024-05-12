import React from 'react';
import { StyleSheet, Text, TouchableOpacity} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-toast-message';

import WalletIcon from '@/assets/icon/icons-wallet.svg';

const WalletProfile = ({address}) =>{
    return <TouchableOpacity style={styles.container} onPress={()=>{
        Clipboard.setString(address);
        Toast.show({
            type: 'success',
            text1: '알림',
            text2: '주소가 복사 되었습니다 ✅'
        });
    }}>
        <WalletIcon/>
        <Text style={styles.addressText}>{address}</Text>
    </TouchableOpacity> 
};

const styles = StyleSheet.create({
    container:{
        marginTop:8,
        flexDirection:'row',
        alignItems:'center'
    },
    addressText:{
        marginLeft:8
    }
});

export default WalletProfile;