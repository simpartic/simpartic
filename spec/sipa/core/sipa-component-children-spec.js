//----------------------------------------------------------------------------------------------------

SipaComponentChildrenSpec = {};
SipaComponentChildrenSpec.options = {};

//----------------------------------------------------------------------------------------------------

class ParentComponent extends SipaComponent {
}

SipaComponent.registerComponent(ParentComponent);

class ChildComponent extends SipaComponent {
}

SipaComponent.registerComponent(ChildComponent);

//----------------------------------------------------------------------------------------------------

describe('SipaComponent', () => {
    beforeAll(() => {
        SipaTest.enableTestingMode();
    });
    beforeEach(() => {
        $("playground").remove();
        $("body").append($("<playground></playground>")[0]);
    });
    describe('nested children', () => {
        beforeAll(() => {
            ParentComponent = class extends SipaComponent {
                constructor(data = {}, opts = {}) {
                    data.list ??= [];
                    super(data, opts);
                    this._autoinc = 0;
                }

                static template = () => {
                    return `<parent-component>Parent<child-component sipa-alias="child_1" name="'child 1'"></child-component><child-component sipa-alias="child_2" name="'child 2'"></child-component></parent-component>`;
                }
            }

            ChildComponent = class extends SipaComponent {
                constructor(data = {}, opts = {}) {
                    data.name ??= "default";
                    data.id = "child_" + ChildComponent._autoinc++;
                    super(data, opts);
                }

                static template = () => {
                    return `<child-component><%= name %></child-component>`;
                }
            }

            ChildComponent._autoinc = 0;
        });
        it('render parent with children', function () {
            const comp = new ParentComponent();
            const match1 = `<parent-component sipa-id="[0-9]+">Parent<child-component sipa-id="[0-9]+">child 1</child-component><child-component sipa-id="[0-9]+">child 2</child-component></parent-component>`;
            expect(comp.html()).toMatch(match1);
            expect(comp.childrenAliases().length).toEqual(2);
        });
        it('keeps correct references of children, also after rerendering', function () {
            const comp = new ParentComponent();
            comp.append("playground");
            expect(SipaComponent._component_instances.find(c => c._data.id === "child_0")).toBeInstanceOf(ChildComponent);
            expect(SipaComponent._component_instances.find(c => c._data.id === "child_0")._data.name).toEqual("child 1");
            expect(comp.children().child_1 === SipaComponent._component_instances.find(c => c._data.id === "child_0")).toBe(true);
            expect(SipaComponent._component_instances.find(c => c._data.id === "child_1")).toBeInstanceOf(ChildComponent);
            expect(SipaComponent._component_instances.find(c => c._data.id === "child_1")._data.name).toEqual("child 2");
            expect(comp.children().child_2 === SipaComponent._component_instances.find(c => c._data.id === "child_1")).toBe(true);
            let sipa_id_1 = comp.children().child_1._meta.sipa.id;
            expect(ChildComponent.bySipaId(sipa_id_1) === SipaComponent._component_instances.find(c => c._meta.sipa.id === sipa_id_1)).toBe(true);
            let sipa_id_2 = comp.children().child_2._meta.sipa.id;
            expect(ChildComponent.bySipaId(sipa_id_2) === SipaComponent._component_instances.find(c => c._meta.sipa.id === sipa_id_2)).toBe(true);

            comp.remove();
            comp.append("playground");
            comp.update();
            expect(SipaComponent._component_instances.find(c => c._data.id === "child_0")).toBeInstanceOf(ChildComponent);
            expect(SipaComponent._component_instances.find(c => c._data.id === "child_0")._data.name).toEqual("child 1");
            expect(comp.children().child_1 === SipaComponent._component_instances.find(c => c._data.id === "child_0")).toBe(true);
            expect(SipaComponent._component_instances.find(c => c._data.id === "child_1")).toBeInstanceOf(ChildComponent);
            expect(SipaComponent._component_instances.find(c => c._data.id === "child_1")._data.name).toEqual("child 2");
            expect(comp.children().child_2 === SipaComponent._component_instances.find(c => c._data.id === "child_1")).toBe(true);
            sipa_id_1 = comp.children().child_1._meta.sipa.id;
            expect(ChildComponent.bySipaId(sipa_id_1) === SipaComponent._component_instances.find(c => c._meta.sipa.id === sipa_id_1)).toBe(true);
            sipa_id_2 = comp.children().child_2._meta.sipa.id;
            expect(ChildComponent.bySipaId(sipa_id_2) === SipaComponent._component_instances.find(c => c._meta.sipa.id === sipa_id_2)).toBe(true);
        });
    });
});

//----------------------------------------------------------------------------------------------------