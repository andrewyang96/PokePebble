package seniorcheeseman.pokepebbleassistapp;

import android.os.Build;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import org.apache.http.message.BasicNameValuePair;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.List;

import PokemonParts.Party;
import PokemonParts.Pokemon;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = "MyActivity";
    private WebSocketClient mWebSocketClient;
    private boolean mGotPokemon;
    private Party mParty;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        connectWebSocket();
        mGotPokemon = false;
        final Button god = (Button) findViewById(R.id.testButton);
        god.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                findRandomBattle();
                god.setOnClickListener(null);
            }
        });
    }

    private void findRandomBattle()
    {
        sendMessage("|/clearsearch");
        sendMessage("|/search randombattle");
    }

    @Override
    protected void onPause()
    {
        super.onPause();
        mWebSocketClient.close();
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
                if(s.contains("request")&&!mGotPokemon)
                {
                    String[] parts = message.split("request");
                    JSONObject part;
                    try {
                        part = getParty(parts[1].substring(1));//hard coded
                        mGotPokemon = true;
                        JSONObject temp = part.getJSONObject("side");
                        JSONArray pokes = temp.getJSONArray("pokemon");
                        Pokemon[] pokemons = new Pokemon[6];
                        for(int x=0; x<pokes.length();x++) {
                            int[] pp = {12,12,12,12};
                            String[] moves = new String[4];
                            JSONObject poke =(JSONObject) pokes.get(0);
                            JSONArray pokeMoves = (JSONArray) poke.get("moves");
                            for(int y=0; y<4;y++)
                            {
                                moves[y] = (String) pokeMoves.get(y);
                            }
                            String name = ((JSONObject)(pokes.get(x))).getString("ident").split(":")[1];
                            int hp = Integer.parseInt(((JSONObject)(pokes.get(x))).getString("condition").split("/")[1]);
                            pokemons[x] = new Pokemon(name,moves,pp,hp);
                        }
                        mParty = new Party(pokemons);
                    }catch(JSONException e)
                    {
                        e.printStackTrace();
                    }
                }
                Log.d(TAG,message);
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
        Toast.makeText(this,message +": has been sent",Toast.LENGTH_LONG).show();
    }

    /**
     * Parses the websocket input to get jsonarray of the pokemon
     * @param input
     * @return JSONObject of pokemon
     */
    public JSONObject getParty(String input) throws JSONException
    {
        JSONObject party = new JSONObject(input);
        return party;
    }

}
