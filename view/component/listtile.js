import { View, Text } from 'react-native';
import { Colors, styles } from "../../assets/styles/style";
import ProcessButton from "./processButton";
import Ionicons from '@expo/vector-icons/Ionicons';

const formatDateIndoensianTime = (timestampStr) => {
    const timestamp = new Date(timestampStr.replace(' ', 'T'));
    const formattedTime = new Intl.DateTimeFormat('id-ID', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
    }).format(timestamp);

    return formattedTime;
};

const formatIndonesianDate = (timestampStr) => {
    const timestamp = new Date(timestampStr.replace(' ', 'T'));
    const formattedDate = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(timestamp);

    return formattedDate;
};

export default ListTile = ({
    data,
    navigation,
    level,
    picApproval,
    type
}) => (
    <>
        <View style={styles.cardContainer}>
            {
                data.length > 0 ? data.map((docs, index) =>
                    <ProcessButton
                        buttonStyle={[styles.card, { backgroundColor: index % 2 == 0 ? Colors.secondary : Colors.grey }]}
                        onButtonPressed={() => 
                            navigation.navigate(type == 'CSO' ? "DetailResumeCso" : "DetailResumeCss", {
                            trsid: docs.trsid,
                            staffstokapproval: docs.staffstokapproval,
                            picwrhapproval: docs.picwrhapproval,
                            wrhapproval: docs.wrhapproval,
                            facapproval: docs.facapproval,
                            purapproval: docs.purapproval,
                            kaopsapproval: docs.kaopsapproval,
                            regmenapproval: docs.regmenapproval
                        })}
                        additionalComponent={
                            <View style={{ flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                <Text style={{ marginBottom: 5 }}>Dokumen: <Text style={{ fontWeight: 'bold' }}> {docs.doccsoid}</Text></Text>
                                <Text style={{ marginBottom: 5 }}>Material: <Text style={{ fontWeight: 'bold' }}> {docs.csomaterial}</Text></Text>
                                <Text style={{ marginBottom: 5 }}>Tanggal: <Text style={{ fontWeight: 'bold' }}> {formatIndonesianDate(docs.startcsodate)}</Text></Text>
                                {
                                    level == 2 ?
                                        docs.staffstokapproval == 1 ?
                                            <View style={{ flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                                <Text style={{ color: "green", marginBottom: 5, fontWeight: 'bold' }}><Ionicons name="checkmark" size={15} color="green" /> Approved</Text>
                                                <Text style={{ color: "green", marginBottom: 5 }}>Approved By: <Text style={{ fontWeight: 'bold' }}> {picApproval.map(pic => pic.id == docs.staffstokapproved_by ? pic.name : null)}</Text></Text>
                                                <Text style={{ color: "green", marginBottom: 5 }}>Approved At: <Text style={{ fontWeight: 'bold' }}> {`${formatIndonesianDate(docs.staffstokapproved_at)}, ${formatDateIndoensianTime(docs.staffstokapproved_at)}`}</Text></Text>
                                            </View>
                                            :
                                            <Text style={{ color: "red", fontWeight: 'bold' }}>
                                                <Ionicons name="close-outline" size={15} color="red" /> Not Approved
                                            </Text>
                                        :
                                        level == 5 ? docs.picwrhapproval == 1 ?
                                            <View style={{ flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                                <Text style={{ color: "green", marginBottom: 5, fontWeight: 'bold' }}><Ionicons name="checkmark" size={15} color="green" /> Approved</Text>
                                                <Text style={{ color: "green", marginBottom: 5 }}>Approved By: <Text style={{ fontWeight: 'bold' }}> {picApproval.map(pic => pic.id == docs.picwrhapproved_by ? pic.name : null)}</Text></Text>
                                                <Text style={{ color: "green", marginBottom: 5 }}>Approved At: <Text style={{ fontWeight: 'bold' }}> {`${formatIndonesianDate(docs.picwrhapproved_at)}, ${formatDateIndoensianTime(docs.picwrhapproved_at)}`}</Text></Text>
                                            </View>
                                            :
                                            <Text style={{ color: "red", fontWeight: 'bold' }}>
                                                <Ionicons name="close-outline" size={15} color="red" /> Not Approved
                                            </Text>
                                            :
                                            //picwrh
                                            level == 6 ? docs.wrhapproval == 1 ?
                                                <View style={{ flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                                    <Text style={{ color: "green", marginBottom: 5, fontWeight: 'bold' }}><Ionicons name="checkmark" size={15} color="green" /> Approved</Text>
                                                    <Text style={{ color: "green", marginBottom: 5 }}>Approved By: <Text style={{ fontWeight: 'bold' }}> {picApproval.map(pic => pic.id == docs.wrhapproved_by ? pic.name : null)}</Text></Text>
                                                    <Text style={{ color: "green", marginBottom: 5 }}>Approved At: <Text style={{ fontWeight: 'bold' }}> {`${formatIndonesianDate(docs.wrhapproved_at)}, ${formatDateIndoensianTime(docs.wrhapproved_at)}`}</Text></Text>
                                                </View>
                                                :
                                                <Text style={{ color: "red", fontWeight: 'bold' }}>
                                                    <Ionicons name="close-outline" size={15} color="red" /> Not Approved
                                                </Text>
                                                :
                                                //kawrh
                                                level == 7 ? docs.facapproval == 1 ?
                                                    <View style={{ flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                                        <Text style={{ color: "green", marginBottom: 5, fontWeight: 'bold' }}><Ionicons name="checkmark" size={15} color="green" /> Approved</Text>
                                                        <Text style={{ color: "green", marginBottom: 5 }}>Approved By: <Text style={{ fontWeight: 'bold' }}> {picApproval.map(pic => pic.id == docs.facapproved_by ? pic.name : null)}</Text></Text>
                                                        <Text style={{ color: "green", marginBottom: 5 }}>Approved At: <Text style={{ fontWeight: 'bold' }}> {`${formatIndonesianDate(docs.facapproved_at)}, ${formatDateIndoensianTime(docs.facapproved_at)}`}</Text></Text>
                                                    </View>
                                                    :
                                                    <Text style={{ color: "red", fontWeight: 'bold' }}>
                                                        <Ionicons name="close-outline" size={15} color="red" /> Not Approved
                                                    </Text>
                                                    :
                                                    //kafac
                                                    level == 8 ? docs.purapproval == 1 ?
                                                        <View style={{ flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                                            <Text style={{ color: "green", marginBottom: 5, fontWeight: 'bold' }}><Ionicons name="checkmark" size={15} color="green" /> Approved</Text>
                                                            <Text style={{ color: "green", marginBottom: 5 }}>Approved By: <Text style={{ fontWeight: 'bold' }}> {picApproval.map(pic => pic.id == docs.purapproved_by ? pic.name : null)}</Text></Text>
                                                            <Text style={{ color: "green", marginBottom: 5 }}>Approved At: <Text style={{ fontWeight: 'bold' }}> {`${formatIndonesianDate(docs.purapproved_at)}, ${formatDateIndoensianTime(docs.purapproved_at)}`}</Text></Text>
                                                        </View>
                                                        :
                                                        <Text style={{ color: "red", fontWeight: 'bold' }}>
                                                            <Ionicons name="close-outline" size={15} color="red" /> Not Approved
                                                        </Text>
                                                        :
                                                        //kapur
                                                        level == 9 ? docs.kaopsapproval == 1 ?
                                                            <View style={{ flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                                                <Text style={{ color: "green", marginBottom: 5, fontWeight: 'bold' }}><Ionicons name="checkmark" size={15} color="green" /> Approved</Text>
                                                                <Text style={{ color: "green", marginBottom: 5 }}>Approved By: <Text style={{ fontWeight: 'bold' }}> {picApproval.map(pic => pic.id == docs.kaopsapproved_by ? pic.name : null)}</Text></Text>
                                                                <Text style={{ color: "green", marginBottom: 5 }}>Approved At: <Text style={{ fontWeight: 'bold' }}> {`${formatIndonesianDate(docs.kaopsapproved_at)}, ${formatDateIndoensianTime(docs.kaopsapproved_at)}`}</Text></Text>
                                                            </View>
                                                            :
                                                            <Text style={{ color: "red", fontWeight: 'bold' }}>
                                                                <Ionicons name="close-outline" size={15} color="red" /> Not Approved
                                                            </Text>
                                                            :
                                                            //kaops
                                                            level == 10 ?
                                                                docs.regmenapproval == 1 ?
                                                                    <View style={{ flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                                                        <Text style={{ color: "green", marginBottom: 5, fontWeight: 'bold' }}><Ionicons name="checkmark" size={15} color="green" /> Approved</Text>
                                                                        <Text style={{ color: "green", marginBottom: 5 }}>Approved By: <Text style={{ fontWeight: 'bold' }}> {picApproval.map(pic => pic.id == docs.regmenapproved_by ? pic.name : null)}</Text></Text>
                                                                        <Text style={{ color: "green", marginBottom: 5 }}>Approved At: <Text style={{ fontWeight: 'bold' }}> {`${formatIndonesianDate(docs.regmenapproved_at)}, ${formatDateIndoensianTime(docs.regmenapproved_at)}`}</Text></Text>
                                                                    </View>
                                                                    :
                                                                    <Text style={{ color: "red", fontWeight: 'bold' }}>
                                                                        <Ionicons name="close-outline" size={15} color="red" /> Not Approved
                                                                    </Text>
                                                                :
                                                                null

                                }
                            </View>

                        }
                    />
                ) :
                    <View style={styles.styledContainerMulaiCSO}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
                            Belum ada document yang perlu approval
                        </Text>
                    </View>
            }
        </View >
    </>
)