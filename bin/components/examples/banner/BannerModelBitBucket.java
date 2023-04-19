package nl.dept.aem.edelweiss.core.models;

import nl.dept.aem.edelweiss.core.utils.LinkUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.inject.Inject;


@Model(adaptables = Resource.class)
public class BannerModel {

    @Inject
    private ResourceResolver resourceResolver;

    @ValueMapValue(injectionStrategy=InjectionStrategy.OPTIONAL)
    protected String title1;
    @ValueMapValue(injectionStrategy=InjectionStrategy.OPTIONAL)
    protected String preTitle1;
    @ValueMapValue(injectionStrategy=InjectionStrategy.OPTIONAL)
    protected String link1;
    @ValueMapValue(injectionStrategy=InjectionStrategy.OPTIONAL)
    protected Boolean checkbox;
    @ValueMapValue(injectionStrategy=InjectionStrategy.OPTIONAL)
    protected String imageReference1;
    @ValueMapValue(injectionStrategy=InjectionStrategy.OPTIONAL)
    protected String id1;
    @ValueMapValue(injectionStrategy=InjectionStrategy.OPTIONAL)
    protected String title2;
    @ValueMapValue(injectionStrategy=InjectionStrategy.OPTIONAL)
    protected String preTitle2;
    @ValueMapValue(injectionStrategy=InjectionStrategy.OPTIONAL)
    protected String link2;
    @ValueMapValue(injectionStrategy=InjectionStrategy.OPTIONAL)
    protected Boolean checkbox2;
    @ValueMapValue(injectionStrategy=InjectionStrategy.OPTIONAL)
    protected String imageReference2;
    @ValueMapValue(injectionStrategy=InjectionStrategy.OPTIONAL)
    protected String id2;

    public String getTitle1() {
        return title1;
    }

    public String getPreTitle1() {
        return preTitle1;
    }

    public String getLink1() {
        return LinkUtils.getLink(link1, resourceResolver);
    }

    public String getImageReference1() {
        return imageReference1;
    }

    public String getTitle2() {
        return title2;
    }

    public String getPreTitle2() {
        return preTitle2;
    }

    public String getLink2() {
        return LinkUtils.getLink(link2, resourceResolver);
    }

    public String getImageReference2() {
        return imageReference2;
    }

    public String getId1() {
        return id1;
    }

    public String getId2() {
        return id2;
    }

    public boolean getCheckbox(){
        return checkbox;
    }

    public boolean getCheckbox2(){
        return checkbox2;
    }
}
