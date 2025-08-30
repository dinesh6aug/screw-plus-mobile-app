import { useLocalSearchParams, useNavigation } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface PdfPreviewProps {
  url: string;
}

const PdfPreview: React.FC<PdfPreviewProps> = ({ }) => {

  const { invoiceNo, invoiceUri }: any = useLocalSearchParams();
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({
      title: `Invoice [${invoiceNo}]`,
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* <WebView
        source={{ uri: invoiceUri }}
        style={styles.webview}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator
            size="large"
            color="#6C63FF"
            style={styles.loader}
          />
        )}
      /> */}

      {
        invoiceUri && (
          <>
            {
              Platform.OS === 'android' ? (
                <WebView
                  source={{ uri: `https://drive.google.com/viewerng/viewer?embedded=true&url=${invoiceUri}` }}
                  style={styles.webview}
                  scalesPageToFit={true}
                  automaticallyAdjustContentInsets={true}
                  injectedJavaScript={`
                    const meta = document.createElement('meta'); 
                    meta.setAttribute('name', 'viewport'); 
                    meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes'); 
                    document.getElementsByTagName('head')[0].appendChild(meta);
                    true;
                `}
                />
              ) : Platform.OS === 'ios' ? (
                <WebView
                  source={{ uri: invoiceUri }}
                  style={styles.webview}
                />
              ) : null
            }
          </>
        )
      }
    </View>
  );
};

export default PdfPreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
  },
});
