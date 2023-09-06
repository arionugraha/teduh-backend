import java.util.HashMap;

public class Encoding {
    private static HashMap<String, String> map = new HashMap<>() {
        {
            put("T", "0");
            put("E", "1");
            put("D", "2");
            put("U", "3");
            put("H", "4");
            put("A", "5");
            put("S", "6");
            put("Y", "7");
            put("I", "8");
            put("K", "9");
        }
    };

    public static void main(String[] args) {
        System.out.println(encodeBaju("AT", "YH", 70000));
        System.out.println(encodeBaju("ESH", "DTT", 150000));
    }

    // String parameters are selling price
    public static String encodeBaju(String batasHarga, String hargaIdeal, int hargaTawar) {

        // Check batasHarga parameter
        String batasHargaEncoded = "";
        for (int i = 0; i < batasHarga.length(); i++) {
            String temp = map.get(String.valueOf(batasHarga.charAt(i)));
            if (temp != null) {
                batasHargaEncoded += temp;
            } else {
                return "Invalid input for batasHarga parameter.";
            }
        }
        batasHargaEncoded += "000";
        int batasHargaNumber = Integer.parseInt(batasHargaEncoded);

        // Check hargaIdeal parameter
        String hargaIdealEncoded = "";
        for (int i = 0; i < hargaIdeal.length(); i++) {
            String temp = map.get(String.valueOf(hargaIdeal.charAt(i)));
            if (temp != null) {
                hargaIdealEncoded += temp;
            } else {
                return "Invalid input for hargaIdeal parameter.";
            }
        }
        hargaIdealEncoded += "000";
        int hargaIdealNumber = Integer.parseInt(hargaIdealEncoded);

        if (hargaTawar < batasHargaNumber) {
            return "REJECT, belum balik modal nih!";
        } else if (hargaTawar >= batasHargaNumber && hargaTawar < hargaIdealNumber) {
            return "ACCEPT, terima kasih sudah berbelanja.";
        } else {
            return "GOOD, customer terbaik gak pake nawar.";
        }
    }
}
