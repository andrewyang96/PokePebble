package PokemonParts;

/**
 * Created by Arthur on 10/17/2015.
 */
public class Party {
    private Pokemon[] mParty;

    public Party(Pokemon[] party) {
        mParty = party;
    }

    public void useMove(int move) {
        mParty[0].useMove(move);
    }

    public void faintPokemon() {
        mParty[0].setFainted();
    }

    public boolean isFainted(int pos) {
        return mParty[pos].isFainted();
    }

    public void switchPokemon(int pos1, int pos2) {
        Pokemon temp = mParty[pos1];
        mParty[pos1] = mParty[pos2];
        mParty[pos2] = temp;
    }

}
