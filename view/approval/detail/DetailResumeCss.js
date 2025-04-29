import { View, Text, ActivityIndicator, Modal } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { Colors, styles } from '../../../assets/styles/style';
import Icon from 'react-native-vector-icons/AntDesign';
import AvoidingWrapper from '../../../assets/styles/avoidingWrapper';
import { CredentialContext } from '../../../Credentials';
import ProcessButton from '../../component/processButton';
import { Table, Row, Rows } from 'react-native-table-component';
import ApprovalController from "../../../controller/ApprovalController";
import Accordion from 'react-native-collapsible/Accordion';


export default function DetailResumeCss({ route, navigation }) {
    const { trsid, staffstokapproval, picwrhapproval, wrhapproval,
        facapproval, purapproval, kaopsapproval, regmenapproval } = route.params;
    const { storedCredentials, setStoredCredentials } = useContext(CredentialContext);
    const [statusButtonApprove] = useState(storedCredentials[2] == 2 && staffstokapproval == 1 ? false :
        storedCredentials[2] == 5 && picwrhapproval == 1 ? false :
            storedCredentials[2] == 6 && wrhapproval == 1 ? false :
                storedCredentials[2] == 7 && facapproval == 1 ? false :
                    storedCredentials[2] == 8 && purapproval == 1 ? false :
                        storedCredentials[2] == 9 && kaopsapproval == 1 ? false :
                            storedCredentials[2] == 10 && regmenapproval == 1 ? false :
                                true);
    const [pelaku, setPelaku] = useState([]);
    const [analisator, setAnalisator] = useState([]);
    const picCsoRowWidth = [30, 75, 75, 170];
    const picCsoHeader = ['No', 'Nama', 'Departemen', 'Catatan'];

    const [activeSectionRekapitulasi, setActiveSectionRekapitulasi] = useState([]);
    const [rekapitulasi, setRekapitulasi] = useState([]);

    const [activeSectionKesalahanAdmin, setActiveSectionItemKesalahanAdmin] = useState([]);
    const [selisihKesalahanAdmin, setSelisihKesalahanAdmin] = useState([]);

    const [activeSectionItemTertukar, setActiveSectionItemTertukar] = useState([]);
    const [selisihTertukar, setSelisihTertukar] = useState([]);

    const [activeSectionItemPlusMinus, setActiveSectionItemPlusMinus] = useState([]);
    const [selisihPlusMinus, setSelisihPlusMinus] = useState([]);

    const [selisihItemTidakHitung, setSelisihItemTidakHitung] = useState([]);
    const [historyTigaBulan, setHistoryTigaBulan] = useState([]);
    const [coy, setCoy] = useState('');
    const [dataCso, setDataCso] = useState([]);
    const [isWaiting, setIsWaiting] = useState(true);
    const [activeSection, setActiveSection] = useState([]);

    const SECTIONS = [
        {
            title: 'I. PELAKSANAAN CSS',
            content:
                <View style={styles.accordionContent}>
                    <Text style={styles.accordionContentText}>Nama Perusahaan: <Text style={{ fontWeight: 'bold' }}>{coy}</Text></Text>
                    <Text style={styles.accordionContentText}>Tanggal Pelaksanaan CSS: <Text style={{ fontWeight: 'bold' }}>{dataCso.startcsodate}</Text></Text>
                    <Text style={[styles.accordionContentText, { marginBottom: 10 }]}>Lokasi/kelompok produk yang di CSS: <Text style={{ fontWeight: 'bold' }}>{dataCso.csomaterial}</Text></Text>
                </View>
            ,
        },
        {
            title: 'II. SUSUNAN TIM CEK STOK SAMPLING',
            content:
                <View style={styles.accordionContent}>
                    <View style={[styles.accordionTable.container, { marginTop: 5 }]}>
                        <Text style={styles.accordionTable.title}>Analisator</Text>
                        <Table borderStyle={styles.accordionTable}>
                            <Row
                                widthArr={picCsoRowWidth}
                                data={picCsoHeader}
                                style={styles.accordionTable.headerBackground}
                                textStyle={styles.accordionTable.headerText}
                            />
                            <Rows
                                widthArr={picCsoRowWidth}
                                data={analisator}
                                textStyle={styles.accordionTable.contentText}
                            />
                        </Table>
                    </View>
                    <View style={styles.accordionTable.container}>
                        <Text style={styles.accordionTable.title}>Pelaku</Text>
                        <Table borderStyle={styles.accordionTable}>
                            <Row
                                widthArr={picCsoRowWidth}
                                data={picCsoHeader}
                                style={styles.accordionTable.headerBackground}
                                textStyle={styles.accordionTable.headerText}
                            />
                            <Rows
                                widthArr={picCsoRowWidth}
                                data={pelaku}
                                textStyle={styles.accordionTable.contentText}
                            />
                        </Table>
                    </View>
                </View>,
        },
        {
            title: 'III. REKAPITULASI HASIL CSS GLOBAL',
            content:
                <View style={styles.accordionContent}>
                    <View style={[styles.accordionTable.container, { marginTop: 5 }]}>
                    <Accordion
                            underlayColor={Colors.grey}
                            activeSections={activeSectionRekapitulasi}
                            sections={rekapitulasi}
                            renderHeader={(section) => {
                                return (
                                    <View>
                                        <Text style={{ fontWeight: 'bold', fontSize: 11 }}>{section.title}</Text>
                                    </View>
                                );
                            }}
                            renderContent={(section) => {
                                return section.content;
                            }}
                            onChange={setActiveSectionRekapitulasi}
                            sectionContainerStyle={styles.accordiodNestedRow}
                        />                       
                    </View>
                </View >,
        },
        {
            title: 'IV. LIST ITEM BARANG YANG SELISIH',
            content:
                <View style={styles.accordionContent}>
                    <View style={[styles.accordionTable.container, { marginTop: 5 }]}>
                        <Text style={styles.accordionTable.title}>Kesalahan Admin </Text>
                        <Accordion
                            underlayColor={Colors.grey}
                            activeSections={activeSectionKesalahanAdmin}
                            sections={selisihKesalahanAdmin}
                            renderHeader={(section) => {
                                return (
                                    <View>
                                        <Text style={{ fontWeight: 'bold', fontSize: 11 }}>{section.title}</Text>
                                    </View>
                                );
                            }}
                            renderContent={(section) => section.content}
                            onChange={setActiveSectionItemKesalahanAdmin}
                            sectionContainerStyle={styles.accordiodNestedRow}

                        />
                    </View>
                    <View style={styles.accordionTable.container}>
                        <Text style={styles.accordionTable.title}>Item Tertukar</Text>
                        <Accordion
                            underlayColor={Colors.grey}
                            activeSections={activeSectionItemTertukar}
                            sections={selisihTertukar}
                            renderHeader={(section) => {
                                return (
                                    <View>
                                        <Text style={{ fontWeight: 'bold', fontSize: 11 }}>{section.title}</Text>
                                    </View>
                                );
                            }}
                            renderContent={(section) => {
                                return section.content;
                            }}
                            onChange={setActiveSectionItemTertukar}
                            sectionContainerStyle={styles.accordiodNestedRow}
                        />
                    </View>
                    <View style={styles.accordionTable.container}>
                        <Text style={styles.accordionTable.title}>Item Selisih Plus Minus</Text>
                        <Accordion
                            underlayColor={Colors.grey}
                            activeSections={activeSectionItemPlusMinus}
                            sections={selisihPlusMinus}
                            renderHeader={(section) => {
                                return (
                                    <View>
                                        <Text style={{ fontWeight: 'bold', fontSize: 11 }}>{section.title}</Text>
                                    </View>
                                );
                            }}
                            renderContent={(section) => section.content}
                            onChange={setActiveSectionItemPlusMinus}
                            sectionContainerStyle={styles.accordiodNestedRow}

                        />
                    </View>
                </View>,
        },
        {
            title: 'V. HISTORY CSS 3 BULAN TERAKHIR',
            content:
                <View style={styles.accordionContent}>
                    <View style={[styles.accordionTable.container, { marginBottom: 10, marginTop: 10 }]}>
                        <Table borderStyle={styles.accordionTable}>
                            <Row
                                widthArr={[60, 130, 55, 65, 40]}
                                data={['Bulan', 'Item', 'Qty CSO', 'Qty sesuai', '%']}
                                style={styles.accordionTable.headerBackground}
                                textStyle={styles.accordionTable.headerText}
                            />
                            <Rows
                                widthArr={[60, 130, 55, 65, 40]}
                                data={historyTigaBulan}
                                textStyle={styles.accordionTable.contentText}
                            />
                        </Table>
                    </View>
                </View>,
        },
    ];
    // console.log(SECTIONS);
    useEffect(() => {
        ApprovalController.resumeCsoItem(
            trsid,
            "CSS",
            setPelaku,
            setAnalisator,
            setRekapitulasi,
            setSelisihKesalahanAdmin,
            setSelisihTertukar,
            setSelisihPlusMinus,
            setSelisihItemTidakHitung,
            setHistoryTigaBulan,
            setCoy,
            setDataCso,
            setIsWaiting
        );
    }, []);

    return (
        <AvoidingWrapper>
            <View style={styles.styledContainer}>
                <Modal transparent={true} visible={isWaiting} animationType='none'>
                    <View style={styles.detailWaitingModal}>
                        <ActivityIndicator size="large" color={Colors.blue} />
                    </View>
                </Modal>
                <View style={styles.resumeButtonContainer}>
                    <ProcessButton
                        buttonStyle={styles.resumeDownloadPDF}
                        onButtonPressed={() => ApprovalController.downloadResumeItem(trsid)}
                        additionalComponent={<Text style={styles.buttonAccountText}>Download Resume As PDF <Icon name='pdffile1' size={18} /></Text>}
                    />
                    <ProcessButton
                        buttonStyle={styles.resumeDownloadPDF}
                        onButtonPressed={() => ApprovalController.downloadLaporanItem(trsid)}
                        additionalComponent={<Text style={styles.buttonAccountText}>Download Laporan As PDF <Icon name='pdffile1' size={18} /></Text>}
                    />
                </View>
                <Accordion
                    underlayColor={Colors.grey}
                    activeSections={activeSection}
                    sections={SECTIONS}
                    renderHeader={(section) => {
                        return (
                            <View style={styles.accordionHeader}>
                                <Text style={{ fontWeight: 'bold' }}>{section.title}</Text>
                            </View>
                        );
                    }}
                    renderContent={(section) => {
                        return section.content;
                    }}
                    onChange={setActiveSection}
                    sectionContainerStyle={styles.accordion}

                />

                {
                    statusButtonApprove == true ?
                        <ProcessButton
                            buttonStyle={styles.buttonSubmit}
                            onButtonPressed={
                                () => ApprovalController.aprroveCsoItem(trsid, storedCredentials[2], storedCredentials[4], navigation)
                            }
                            additionalComponent={<Text style={styles.buttonAccountText}>Approve from {
                                storedCredentials[2] == 2 ? 'Staff Stok' :
                                    storedCredentials[2] == 5 ? 'PIC Warehouse' :
                                        storedCredentials[2] == 6 ? 'Warehouse' :
                                            storedCredentials[2] == 7 ? 'FAC' :
                                                storedCredentials[2] == 8 ? 'Purchasing' :
                                                    storedCredentials[2] == 9 ? 'Ka Ops' :
                                                        storedCredentials[2] == 10 ? 'RegMen' :
                                                            null
                            } </Text>}
                        /> : null
                }


            </View>
        </AvoidingWrapper>
    )
}
