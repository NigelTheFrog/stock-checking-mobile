import { View, Text } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { Colors, styles } from '../../../../assets/styles/style';
import Ionicons from '@expo/vector-icons/Ionicons';
import AvoidingWrapper from '../../../../assets/styles/avoidingWrapper';
import { CredentialContext } from '../../../../Credentials';
import ProcessController from '../../../../controller/ProcessController';
import Input from '../../../component/input';
import Dropdownitem from '../../../component/dropdownitem';
import Multiselectitem from '../../../component/multiselectitem';
import ProcessButton from '../../../component/processButton';
import DetailController from '../../../../controller/DetailController';
import Calculator from '../../../component/calculator';

export default function DetailAvalan({ route, navigation }) {
    const { csodetid, csodet2id, itemname, dimensionItem, toleranceItem, statusitem, statushslcso, color, trsid, csoid,
        itemid, trsdet, itembatchid, qty, historylist, location, gradeid, remark,
        inputlist, statussubmit, tonase, qty_pengali, pengali } = route.params;
    const { storedCredentials, setStoredCredentials } = useContext(CredentialContext);
    const [itemData, setItemData] = useState([]);
    const [lokasiData, setLokasiData] = useState([]);
    const [warnaData, setWarnaData] = useState([]);
    const [gradeData, setGradeData] = useState([]);
    const [item, setItem] = useState(itemid);
    const [itemBatch, setItemBatch] = useState(itembatchid);
    const [itemName, setItemName] = useState(itemname);
    const [trsdetid, setTrsDetId] = useState(trsdet);
    const [lokasi, setLokasi] = useState(location);
    const [dimension, setDimension] = useState(dimensionItem);
    const [tolerance, setTolerance] = useState(toleranceItem);
    const [warna, setWarna] = useState(color);
    const [keterangan, onChangeKeterangan] = useState(remark);
    const [grade, setGrade] = useState(gradeid);
    const [history, setHistory] = useState(historylist);
    const [displayInput, setDisplayInput] = useState('');
    const [boxQty, setBoxQty] = useState(qty_pengali ? qty_pengali : '');
    const [isianBox, setIsianBox] = useState(pengali ? pengali : '');
    const [hasilPerkalian, setHasilPerkalian] = useState(qty_pengali && pengali ? (parseFloat(qty_pengali) * parseFloat(pengali).toString) : '');
    const [tempInput, setTempInput] = useState('');
    const [input, setInput] = useState(inputlist);
    const [isFocus, setIsFocus] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [csoDetId, setCsoDetId] = useState(csodetid);
    const [csoDet2Id, setCsoDet2Id] = useState(csodet2id);
    const [resultCalc, setResultCalc] = useState(qty);
    const [tonaseQty, setTonaseQty] = useState(tonase);
    const [itemType, setItemType] = useState(statusitem);

    useEffect(() => {
        ProcessController.setData(`avalan-list?trsid=${trsid}`, "itemid", "itemname", setItemData, 1, setItem);
        ProcessController.setData('location-list', "locationid", "locationname", setLokasiData, 2, setLokasi);
        ProcessController.setData('color-list', "colorid", "colordesc", setWarnaData, 0, setWarna);
        if(itemType == 'A') ProcessController.setData(`grade-list?trsdetid=${trsdet}&statusitem=${statusitem}`, "gradecode", "description", setGradeData, 0, setGrade);
        else ProcessController.setData('grade-list?statusitem=TA', "gradecode", "description", setGradeData, 0, setGrade);
    }, []);

    return (
        <AvoidingWrapper>
            <View style={styles.styledContainer}>
                <Calculator
                    isVisible={isModalVisible}
                    closeModal={setModalVisible}
                    modalStyle={styles.modalView}
                    input={input}
                    setInput={setInput}
                    history={history}
                    setHistory={setHistory}
                    displayInput={displayInput}
                    setDisplayInput={setDisplayInput}
                    resultCalculation={resultCalc}
                    setResultCalculation={setResultCalc}
                    temporaryInput={tempInput}
                    setTemporaryInput={setTempInput}
                    boxQty={boxQty}
                    setBoxQty={setBoxQty}
                    isianBox={isianBox}
                    setIsianBox={setIsianBox}
                    hasilPerkalian={hasilPerkalian}
                    setHasilPerkalian={setHasilPerkalian}
                    setter={() => ProcessController.submitPerhitungan(
                        csoDet2Id, tempInput, history, input,
                        [setInput, setResultCalc, setHistory, setDisplayInput, setTempInput, setHasilPerkalian],
                        [boxQty, isianBox, hasilPerkalian]
                    )}
                />
                {itemType == 'A' && statushslcso == 'D' && statussubmit != "P" ?
                    <Dropdownitem
                        groupStyle={styles.formGroup}
                        labelStyle={styles.formGroupLabel}
                        label='Item'
                        dropdownStyle={styles.formGroupInput}
                        data={itemData}
                        placeHolder="--Pilih Avalan--"
                        placeHolderStyle={styles.formGroupPlaceHolderStyle}
                        setFocus={setIsFocus}
                        searchPlaceholder='Cari...'
                        valueField="value"
                        value={item}
                        setter={item => {
                            setItem(item.value);
                            setItemBatch(item.id);
                            setTrsDetId(item.trsdetid);
                            setDimension(item.dimension);
                            setTolerance(item.tolerance);
                            setIsFocus(false);
                            ProcessController.setData(`grade-list?trsdetid=${item['trsdetid']}&statusitem=${item['statusitem']}`, "gradecode", "description", setGradeData, 0, setGrade);
                        }}
                    />

                    :
                    <Input
                        groupStyle={styles.formGroup}
                        labelStyle={styles.formGroupLabel}
                        label='Item'
                        textInputStyle={styles.formGroupNamaItem}
                        setter={setItemName}
                        value={itemName}
                        statusEditable={itemType == 'TA' && statushslcso == 'D' && statussubmit != "P" ? true : false}
                    />
                }

                <Input
                    groupStyle={styles.formGroup}
                    labelStyle={styles.formGroupLabel}
                    label='Dimensi'
                    placeHolder='Dimensi Item Batch'
                    placeHolderStyle={styles.formGroupPlaceHolderStyle}
                    textInputStyle={[styles.formKeterangan, { color: Colors.brand }]}
                    value={dimension}
                    multiline={true}
                    statusEditable={itemType == 'TA' && statushslcso == 'D' && statussubmit != "P" ? true : false}
                    setter={setDimension}
                />

                <Input
                    groupStyle={styles.formGroup}
                    labelStyle={styles.formGroupLabel}
                    label='Toleransi'
                    placeHolder='Toleransi Item Batch'
                    placeHolderStyle={styles.formGroupPlaceHolderStyle}
                    textInputStyle={[styles.formGroupNamaItem, { color: Colors.brand }]}
                    value={tolerance}
                    statusEditable={itemType == 'TA' && statushslcso == 'D' && statussubmit != "P" ? true : false}
                    setter={setTolerance}
                />

                <Dropdownitem
                    groupStyle={styles.formGroup}
                    labelStyle={styles.formGroupLabel}
                    label='Area'
                    dropdownStyle={styles.formGroupInput}
                    data={lokasiData}
                    placeHolder="--Pilih Area--"
                    placeHolderStyle={styles.formGroupPlaceHolderStyle}
                    setFocus={setIsFocus}
                    valueField="value"
                    value={lokasi}
                    setter={lokasi => {
                        setLokasi(lokasi.value);
                        setIsFocus(false);
                    }}
                />

                <Dropdownitem
                    groupStyle={styles.formGroup}
                    labelStyle={styles.formGroupLabel}
                    label='Gudang'
                    dropdownStyle={styles.formGroupInput}
                    data={gradeData}
                    placeHolder="--Pilih Gudang--"
                    placeHolderStyle={styles.formGroupPlaceHolderStyle}
                    setFocus={setIsFocus}
                    valueField="value"
                    value={grade}
                    searchable={false}
                    setter={grade => {
                        setGrade(grade.value);
                        setIsFocus(false);
                    }}
                />

                <Multiselectitem
                    groupStyle={styles.formGroupColor}
                    labelStyle={styles.formGroupColorLabel}
                    label='Kode Cat'
                    dropdownStyle={styles.formGroupColorMultiSelect}
                    data={warnaData}
                    placeHolder='--Pilih Warna--'
                    placeHolderStyle={styles.formGroupPlaceHolderStyle}
                    value={warna}
                    setter={item => {
                        setWarna(item);
                    }}
                />

                <Input
                    groupStyle={styles.formPerhitungan}
                    labelStyle={styles.formPerhitunganLabel}
                    label="Qty."
                    textInputStyle={styles.formPerhitunganInput}
                    value={resultCalc}
                    statusEditable={input.length <= 1 ? true : false}
                    setter={(text) => {
                        setDisplayInput(text);
                        setHistory(text);
                        setTempInput(text);
                        setResultCalc(text);
                    }}
                    keyboardType='numeric'
                    placeHolder='Jumlah Item'
                    placeHolderStyle={styles.formGroupColorPlaceHorlder}
                    additionalItem={
                        <ProcessButton
                            buttonStyle={statussubmit == "P" ? styles.formPerhitunganButtonDisabled : styles.formPerhitunganButton}
                            onButtonPressed={() => setModalVisible(!isModalVisible)}
                            additionalComponent={<Text style={styles.buttonAccountText}>Hitung</Text>}
                            statusDisabled={statussubmit == "P" ? true : false}
                        />
                    }
                />
                {
                    storedCredentials[11] == 'KKS' ?
                        <Input
                            groupStyle={styles.formGroup}
                            labelStyle={styles.formGroupLabel}
                            label='Tonase'
                            textInputStyle={styles.formGroupNamaItem}
                            value={tonaseQty}
                            setter={setTonaseQty}
                        /> : null
                }

                <Input
                    groupStyle={styles.formGroup}
                    labelStyle={styles.formGroupLabel}
                    label='Ket.'
                    textInputStyle={styles.formKeterangan}
                    value={keterangan}
                    setter={onChangeKeterangan}
                    multiline={true}
                />
                {statussubmit == "D" ?
                    <ProcessButton
                        buttonStyle={styles.buttonSubmit}
                        onButtonPressed={
                            () => DetailController.updateItem(
                                [csoDetId, csoDet2Id],
                                [storedCredentials[0], csoid],
                                [item, itemBatch, lokasi, resultCalc, warna, keterangan, grade, trsdetid, tonaseQty, itemName, tolerance, dimension],
                                itemType,
                                navigation.navigate("HomeItem")
                            )
                        }
                        additionalComponent={<Text style={styles.buttonAccountText}><Ionicons name="save-sharp" size={20} color="white" />   Simpan</Text>}
                    />
                    : null}
                {
                    statussubmit == "P" || statushslcso == 'T' ?
                        <ProcessButton
                            buttonStyle={styles.buttonDelete}
                            onButtonPressed={() => navigation.goBack()}
                            additionalComponent={<Text style={styles.buttonAccountText}>Keluar</Text>}
                        />
                        :
                        <ProcessButton
                            buttonStyle={styles.buttonDelete}
                            onButtonPressed={() => DetailController.hapusDataCSO([csoDetId, csoDet2Id], navigation)}
                            additionalComponent={<Text style={styles.buttonAccountText}><Ionicons name="trash" size={20} color="white" />Hapus</Text>}
                        />
                }

            </View>
        </AvoidingWrapper>
    )
}
