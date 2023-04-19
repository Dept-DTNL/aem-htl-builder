public class Usp {
    @ValueMapValue(name="label")
    @Inject
    private String label;

    @ValueMapValue(name="style")
    @Inject
    protected String style;

    private Usp(){
    }
}

public class PageTest{
    @ChildResource(name="uspList")
    @Inject
    protected List<Usp> uspList;
}