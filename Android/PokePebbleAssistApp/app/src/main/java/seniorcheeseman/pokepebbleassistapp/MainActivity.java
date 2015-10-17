package seniorcheeseman.pokepebbleassistapp;

import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.getpebble.android.kit.PebbleKit;
import com.getpebble.android.kit.util.PebbleDictionary;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.UUID;

import PokemonParts.Party;
import PokemonParts.Pokemon;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = "MyActivity";
    private WebSocketClient mWebSocketClient;
    private boolean mGotPokemon;
    private Party mParty;
    private String mBattleRoom;
    private Button mGod, mForfeitButton;
    private View.OnClickListener mFindBattleListener, mForfeitListener;
    private PebbleKit.PebbleDataReceiver mReceiver;
    private static final int MOVE = 1,POS = 2,FORFEIT =3,SWITCH = 4;
    private PebbleDictionary data;
    private final static UUID PEBBLE_APP_UUID = UUID.fromString("46263b9e-6ecf-4454-8388-0638495af75f");

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        connectWebSocket();
        mGotPokemon = false;
        mGod = (Button) findViewById(R.id.testButton);
        mForfeitButton = (Button) findViewById(R.id.forfeitButton);
        mForfeitListener = new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                forfeit();
            }
        };
        mFindBattleListener = new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                findRandomBattle();
                mGod.setOnClickListener(null);
                mForfeitButton.setOnClickListener(mForfeitListener);
            }
        };
        mGod.setOnClickListener(mFindBattleListener);


        if (mReceiver == null) {
            mReceiver = new PebbleKit.PebbleDataReceiver(PEBBLE_APP_UUID) {

                @Override
                public void receiveData(Context context, int id, PebbleDictionary data) {
                    // Always ACKnowledge the last message to prevent timeouts
                    PebbleKit.sendAckToPebble(getApplicationContext(), id);
                    if(data.contains(MOVE))
                    {
                        long t = data.getInteger(POS);
                        int pos =(int) t;
                        makeMove(pos);
                    }
                    else if(data.contains(SWITCH))
                    {
                        long t = data.getInteger(POS);
                        int pos =(int) t;
                        switchPokemon(pos);
                    }
                    else if(data.contains(FORFEIT))
                    {
                        forfeit();
                    }
                    Log.i("receiveData", "Got message from Pebble!");
                    // Get action and display
//                    int state = data.getUnsignedIntegerAsLong().intValue();
                }

            };
        }

        // Register the receiver to get data
        PebbleKit.registerReceivedDataHandler(this, mReceiver);

    }

    private void forfeit() {
        String giveUp = mBattleRoom + "|/forfeit";
        sendMessage(giveUp);
        mForfeitButton.setOnClickListener(null);//todo make it invisible
        mGod.setOnClickListener(mFindBattleListener);
    }


    private void findRandomBattle() {
        sendMessage("|/cancelsearch");
        sendMessage("|/search randombattle");
    }

    private void makeMove(int move) {
        String in = Integer.toString(move + 1);
        sendMessage(mBattleRoom + "|/move " + in);
    }

    private void switchPokemon(int pos) {
        String in = Integer.toString(pos + 1);
        mParty.switchPokemon(0, pos);
        sendMessage(mBattleRoom + "|/switch " + in);
    }


    @Override
    protected void onDestroy() {
        super.onDestroy();
        mWebSocketClient.close();
    }

    @Override
    protected void onResume() {
        super.onResume();

        boolean isConnected = PebbleKit.isWatchConnected(this);

        Toast.makeText(this, "Pebble " + (isConnected ? "is" : "is not") + " connected!", Toast.LENGTH_LONG).show();
        boolean appMessageSupported = PebbleKit.areAppMessagesSupported(this);
        Log.d("PebbleMessages", (appMessageSupported) ? "true" : "false");
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    private void connectWebSocket() {
        URI uri;
        try {
            uri = new URI("ws://159.203.89.223:8000/showdown/websocket");
        } catch (URISyntaxException e) {
            e.printStackTrace();
            return;
        }

        mWebSocketClient = new WebSocketClient(uri) {
            @Override
            public void onOpen(ServerHandshake serverHandshake) {
                Log.i("Websocket", "Opened");
                mWebSocketClient.send("Hello from " + Build.MANUFACTURER + " " + Build.MODEL);
            }

            @Override
            public void onMessage(String s) {
                final String message = s;
                data = new PebbleDictionary();
                if (s.contains("request")) {
                    if (!mGotPokemon) {
                        String[] parts = message.split("request");
                        JSONObject part;
                        try {
                            data.addString(0,"CreateParty");
                            part = getParty(parts[1].substring(1));//hard coded
                            mGotPokemon = true;
                            JSONObject temp = part.getJSONObject("side");
                            JSONArray pokes = temp.getJSONArray("pokemon");
                            Pokemon[] pokemons = new Pokemon[6];
                            for (int x = 0; x < pokes.length(); x++) {
                                int[] pp = {12, 12, 12, 12};
                                for(int y=0;y<4;y++)
                                {
                                    data.addInt32(11*x+6+y+2,pp[y]);
                                }
                                String[] moves = new String[4];
                                JSONObject poke = (JSONObject) pokes.get(0);
                                JSONArray pokeMoves = (JSONArray) poke.get("moves");

                                for (int y = 0; y < 4; y++) {
                                    moves[y] = (String) pokeMoves.get(y);
                                    data.addString(11*x+y+2,moves[y]);
                                }
                                String name = ((JSONObject) (pokes.get(x))).getString("ident").split(":")[1];
                                int pokekeyname = 11*x+1;
                                data.addString(pokekeyname, name);
                                int hp = Integer.parseInt(((JSONObject) (pokes.get(x))).getString("condition").split("/")[1]);
                                data.addInt32(11*x+6,hp);data.addInt32(11*x+7,hp);
                                pokemons[x] = new Pokemon(name, moves, pp, hp);
                                PebbleKit.sendDataToPebble(getApplicationContext(),PEBBLE_APP_UUID,data);
                            }
                            mParty = new Party(pokemons);

                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    } else if (message.contains("active")) {
                        data.addString(0,"UpdateMoves");
                        String[] parts = message.split("request");
                        JSONObject part;
                        try {
                            part = getParty(parts[1].substring(1));
                            JSONArray temp = part.getJSONArray("active");
                            JSONObject first = (JSONObject) temp.get(0);
                            temp = first.getJSONArray("moves");
                            for (int x = 0; x < first.length(); x++) {
                                JSONObject moves = (JSONObject) temp.get(x);
                                if (!moves.getBoolean("disabled"))
                                    mParty.getPokemon(0).changeCurrentPP(x, moves.getInt("pp"));
                                else
                                    mParty.getPokemon(0).changeCurrentPP(x, 0);
                                mParty.getPokemon(0).changeTotalPP(x, moves.getInt("maxpp"));
                                data.addInt32(x + 1, (moves.getInt("pp")));
                                data.addInt32(x+1+4,(moves.getInt("maxpp")));
                                Log.d("PPChanges", Integer.toString(moves.getInt("pp")));
                                Log.d("PPChanges", Integer.toString(moves.getInt("maxpp")));
                            }
                            PebbleKit.sendDataToPebble(getApplicationContext(),PEBBLE_APP_UUID,data);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                } else if (message.contains("battle-randombattle") && mBattleRoom == null) {
                    String[] notBattleRoom = message.split("\\|");
                    mBattleRoom = notBattleRoom[0].substring(1);
                    mBattleRoom = mBattleRoom.replaceAll("\n", "");
                    Log.d("BattleRoom", mBattleRoom);
                } else if ((message.contains("-damage") || message.contains("-heal")) && mParty != null) {
                    data.addString(0,"ChangeHp");
                    String pokemonName = mParty.getPokemon(0).getName();
                    if (message.contains(pokemonName)) {
                        if (message.contains("fnt")) {
                            mParty.getPokemon(0).setFainted();
                            mParty.getPokemon(0).changeHp(0);
                            data.addInt32(1,0);
                        } else {
                            String[] part = message.split("\\|");
                            String hps = part[2];
                            String[] healths = hps.split("/");
                            mParty.getPokemon(0).changeHp(Integer.parseInt(healths[0]));
                            data.addInt32(1,Integer.parseInt((healths[0])));
                        }
                        PebbleKit.sendDataToPebble(getApplicationContext(),PEBBLE_APP_UUID,data);
                        Log.d("Hploss", Integer.toString(mParty.getPokemon(0).getHp()));
                    }
                }
                Log.d(TAG, message);
            }

            @Override
            public void onClose(int i, String s, boolean b) {
                Log.i("Websocket", "Closed " + s);
            }

            @Override
            public void onError(Exception e) {
                Log.i("Websocket", "Error " + e.getMessage());
            }
        };
        mWebSocketClient.connect();
    }

    public void sendMessage(String message) {
        mWebSocketClient.send(message);
        Log.d("WebsocketMessages", message);
        Toast.makeText(this, message + ": has been sent", Toast.LENGTH_LONG).show();
    }

    /**
     * Parses the websocket input to get jsonarray of the pokemon
     *
     * @param input
     * @return JSONObject of pokemon
     */
    public JSONObject getParty(String input) throws JSONException {
        JSONObject party = new JSONObject(input);
        return party;
    }

}
