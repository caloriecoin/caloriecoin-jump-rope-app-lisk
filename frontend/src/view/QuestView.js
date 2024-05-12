import React, { useState } from 'react';
import { View, Text, Image, Modal, TouchableOpacity, FlatList } from 'react-native';

import FloatingButton from '@components/common/FloatingButton';

import QuestLockIcon from '@/assets/icon/quest-lock.svg';

import QuestJumpBronzeImage from '@/assets/image/quest-jump-bronze.png';
import QuestJumpSilverImage from '@/assets/image/quest-jump-silver.png';
import QuestJumpGoldImage from '@/assets/image/quest-jump-gold.png';

import QuestVSBronzeImage from '@/assets/image/quest-vs-bronze.png';
import QuestVSilverImage from '@/assets/image/quest-vs-silver.png';


const data = [
    {
        image: true,
        title: '줄넘기',
        subtitle: '100 회 돌리기'
    },
    {
        image: false,
        title: '줄넘기',
        subtitle: '300 회 돌리기'
    },{
        image: false,
        title: '줄넘기',
        subtitle: '500 회 돌리기'
    },{
        image: false,
        title: '승리',
        subtitle: '10 회'
    },{
        image: false,
        title: '승리',
        subtitle: '100 회'
    },{
        image: false,
        title: '승리',
        subtitle: '500 회'
    },{
        image: false,
        title: '출석',
        subtitle: '3 일'
    },{
        image: false,
        title: '출석',
        subtitle: '7 일'
    },{
        image: false,
        title: '출석',
        subtitle: '30 일'
    },{
        image: false,
        title: '코인 획득',
        subtitle: '500 개'
    },{
        image: false,
        title: '코인 획득',
        subtitle: '3000 개'
    },{
        image: false,
        title: '코인 획득',
        subtitle: '10000 개'
    }
];

const QuestView = ({navigation}) => {

    const [modalView, setModalView] = useState(false);
    const [containerWidth, setContainerWidth] = useState(0);

    return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fff'}}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalView}
        >
            <TouchableOpacity style={{backgroundColor:'#00000088', flex:1, justifyContent:'center', alignItems:'center'}} onPress={()=>{
                setModalView(false);
            }}>
                <View style={{padding:24, backgroundColor:'#fff', justifyContent:'center', alignItems:'center', borderRadius:17, width:'85%'}}>
                    <Text style={{fontFamily:'SUIT-ExtraBold', fontSize:24}}>NFT 퀘스트 방향</Text>
                    <Text style={{fontFamily:'SUIT-Regular', fontSize:18, marginTop:18}}>해당 퀘스트 <Text style={{fontFamily:'SUIT-Bold', color:'#FF3348'}}>NFT</Text>는 추후 <Text style={{fontFamily:'SUIT-Bold', color:'#FF3348'}}>KIP17</Text>을 통해 발급 될 예정이며, 최종으로는 <Text style={{fontFamily:'SUIT-Bold', color:'#FF3348'}}>KIP37</Text>로 코인을 통합하여 <Text style={{fontFamily:'SUIT-Bold', color:'#e1963b'}}>칼로리코인</Text>을 통해 <Text style={{fontFamily:'SUIT-Bold', color:'#FF3348'}}>퀘스트 NFT 증명서</Text>를 발급하고 해당 사용자는 발급된 <Text style={{fontFamily:'SUIT-Bold', color:'#FF3348'}}>NFT</Text>를 활용해 자신만의 <Text style={{fontFamily:'SUIT-Bold', color:'#FF3348'}}>민팅</Text>을 할 수 있는 시스템을 구축 할 것 입니다.</Text>
                    <Text style={{marginTop:28, textAlign:'center', fontFamily:'SUIT-Regular', fontSize:14}}>아무 곳이나 터치하면 창이 닫힙니다.</Text>
                </View>
            </TouchableOpacity>
        </Modal>
        <Text style={{fontFamily:'SUIT-ExtraBold', fontSize:18, marginBottom:18}}>NFT 퀘스트 목록</Text>
        <View style={{width:'90%', marginTop:24}}>
            <FlatList
            data={data}
            columnWrapperStyle={{
                justifyContent: 'space-around',
                marginBottom: 8,
            }}
            onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
            renderItem={({item}) => {
                if(!item.image)
                {
                    return <View style={{
                                width: 100,
                                height: 130,
                                backgroundColor:'#f1f1f5', 
                                borderRadius:18, 
                                justifyContent:'center', 
                                alignItems:'center'
                            }}>
                            <QuestLockIcon width={48} height={48}/>
                            <Text style={{fontFamily:'SUIT-SemiBold', fontSize:12, marginTop: 10, marginBottom:10}}>{item.title}</Text>
                            <Text style={{fontFamily:'SUIT-SemiBold', fontSize:12}}>{item.subtitle}</Text>
                        </View>
                }
                else
                {
                    return <TouchableOpacity 
                                onPress={()=>{
                                    setModalView(true);
                                }}
                                style={{
                                    width: 100,
                                    height: 130,
                                    backgroundColor:'#f1f1f5', 
                                    borderRadius:18, 
                                    justifyContent:'center', 
                                    alignItems:'center'
                                }}>
                                <Image source={QuestJumpBronzeImage} style={{width:48, height:48, paddingBottom:-10, paddingTop:-20}}/>
                                <Text style={{fontFamily:'SUIT-SemiBold', fontSize:12, marginTop: 10, marginBottom:10}}>{item.title}</Text>
                                <Text style={{fontFamily:'SUIT-SemiBold', fontSize:12}}>{item.subtitle}</Text>
                            </TouchableOpacity>
                }
            }}
            keyExtractor={({index}) => index}
            numColumns={3}
            style={{
                width: '100%',
            }}
            />
        </View>
        
        <FloatingButton handleClick={()=>{
            navigation.navigate('wallet_view');
        }}/>
    </View>);
};

export default QuestView;