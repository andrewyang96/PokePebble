package PokemonParts;

/**
 * Created by Arthur on 10/17/2015.
 */
public class Pokemon {
    private String[] mMoves;
    private int[] mTotalPP;
    private int[] mCurrentPP;
    private int mHp;
    private int mMaxhp;
    private String mName;
    private boolean mFainted;

    public Pokemon(String name, String[] moves, int[] totalPP, int maxhp) {
        mName = name;
        mMaxhp = maxhp;
        mHp = maxhp;
        mMoves = moves;
        mFainted = false;
        for (int x = 0; x < totalPP.length; x++) {
            mTotalPP[x] = totalPP[x];
            mCurrentPP[x] = totalPP[x];
        }
    }

    public int[] getTotalPP() {
        return mTotalPP;
    }

    public int[] getCurrentPP() {
        return mCurrentPP;
    }

    public String getName() {
        return mName;
    }

    public int getHp() {
        return mHp;
    }

    /**
     * Updates pp of the move
     *
     * @param move
     */
    public void useMove(int move) {
        mCurrentPP[move]--;
    }

    public int getMaxhp() {
        return mMaxhp;
    }

    public void changeHp(int hp) {
        mHp = hp;
    }

    public void setFainted() {
        mFainted = true;
    }

    public boolean isFainted() {
        return mFainted;
    }
}
