import { View, Text, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';
import { styles } from '../../../assets/styles/style';
import { AppVersion, CredentialContext } from '../../../Credentials';
import Ionicons from '@expo/vector-icons/Ionicons';
import ProcessButton from '../../component/processButton';
import Input from '../../component/input';
import Dropdownitem from '../../component/dropdownitem';
import ApprovalController from '../../../controller/ApprovalController';
import ListTile from '../../component/listtile';

export default function DocumentItemCsoList({ route, navigation }) {
    const { storedCredentials, setStoredCredentials } = React.useContext(CredentialContext);
    const [listData, setListData] = React.useState([]);
    const [listPicApproval, setListPicApproval] = React.useState([]);
    const [listSearchedData, setListSearchedData] = React.useState([]);
    const [searchItem, setSearchItem] = React.useState('');
    const displayDataDoc = () => ApprovalController.displayDocument(storedCredentials[2], "CSO", setListData, setListPicApproval)
    const [isFocus, setIsFocus] = React.useState(false);
    const [statusSubmit, setStatusSubmit] = React.useState('0');
    const [statusData] = React.useState([
        {
            value: 'A',
            label: 'Semua',
        },
        {
            value: '0',
            label: 'Approved',
        },
        {
            value: '1',
            label: 'Not Approved',
        }
    ]);
    let interval2;
    // console.log(route);
    // console.log(storedCredentials[11]);

    // function search(text) {
    //     setSearchItem(text);
    //     let tempItem = [];
    //     if (statusSubmit != '0') {
    //         listData.forEach(item => {
    //             if ((item.itemid.toString().includes(text) || item.itemname.toLowerCase().includes(text.toLowerCase())) && item.statussubmit == statusSubmit) tempItem.push(item)
    //         });
    //     } else {
    //         listData.forEach(item => {
    //             if (item.itemid.toString().includes(text) || item.itemname.toLowerCase().includes(text.toLowerCase())) tempItem.push(item)
    //         });
    //     }
    //     setListSearchedData(tempItem);
    // }

    // function filterStatus(status) {
    //     setStatusSubmit(status.value);
    //     let tempItem = [];
    //     if (searchItem != '') {
    //         if (status.value == '0') {
    //             listData.forEach(item => {
    //                 if (item.itemid.toString().includes(searchItem) || item.itemname.toLowerCase().includes(searchItem.toLowerCase())) tempItem.push(item)
    //             });
    //         } else {
    //             listData.forEach(item => {
    //                 if ((item.itemid.toString().includes(searchItem) || item.itemname.toLowerCase().includes(searchItem.toLowerCase())) && item.statussubmit == status.value) tempItem.push(item)
    //             });
    //         }
    //     } else {
    //         listData.forEach(item => {
    //             if (item.statussubmit == status.value) tempItem.push(item)
    //         });
    //     }
    //     setListSearchedData(tempItem);
    // }
    useFocusEffect(
        React.useCallback(() => {
            interval2 = setInterval(displayDataDoc, 1000);
            return () => {
                clearInterval(interval2);
            };
        }, [])
    );
    return (
        <View style={styles.styledContainer}>
            {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Input
                    groupStyle={[styles.formGroup, { width: '50%' }]}
                    labelStyle={styles.formGroupLabel}
                    label={<Ionicons name="search" size={20} color="black" />}
                    textInputStyle={[styles.formGroupNamaItem, { fontSize: 12 }]}
                    placeHolderStyle={{ fontSize: 8 }}
                    statusEditable={true}
                    value={searchItem}
                    setter={search}
                    placeHolder='Cari Daftar Item CSO'
                />
                <Dropdownitem
                    groupStyle={[styles.formGroup, { width: '45%', marginLeft: 10 }]}
                    labelStyle={styles.formGroupLabel}
                    itemStyle={{ fontSize: 12 }}
                    textLabelStyle={{ fontSize: 11 }}
                    label='Status'
                    dropdownStyle={[styles.formGroupInput, { width: '75%' }]}
                    data={statusData}
                    setFocus={setIsFocus}
                    valueField="value"
                    value={statusSubmit}
                    searchable={false}
                    setter={filterStatus}
                />
            </View>
            */}
            <ScrollView>
                <ListTile
                    data={searchItem || statusSubmit != '0' ? listSearchedData : listData}
                    navigation={navigation}
                    level={storedCredentials[2]}
                    picApproval={listPicApproval}
                    type='CSO'
                />
            </ScrollView>
            <Text style={styles.appVersionLabel}>Version {AppVersion}</Text>
        </View>

    )

}

