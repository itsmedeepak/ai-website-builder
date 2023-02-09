// empty function component

import React from 'react';
import { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom'
import { Airtable } from '../api/Airtable';
import SiteDisplay from './SiteDisplay';
import { Button } from '../components/Button';
import Logo from '../components/Logo';
import DashboardLayout from './shared/DashboardLayout';
import SiteEditor from './SiteEditor';

function SiteBuilder() {

    const base = new Airtable();
    const { siteID } = useParams()

    const [site, setSite] = useState({});

    const [lastUpdated, setLastUpdated] = useState('');
    const [OwnerName, setOwnerName] = useState('');
    const [SiteName, setSiteName] = useState('');
    const [SiteCTA, setSiteCTA] = useState('');
    const [SiteCTALink, setSiteCTALink] = useState('');
    const [SiteCTAType, setSiteCTAType] = useState('');
    const [SiteCTAHeading, setSiteCTAHeading] = useState('');
    const [SiteColor, setSiteColor] = useState('');
    const [SiteHeroHeading, setSiteHeroHeading] = useState('');
    const [SiteHeroSubheading, setSiteHeroSubheading] = useState('');
    const [SiteRecordID, setSiteRecordID] = useState('');
    const [SiteImages, setSiteImages] = useState('');
    const [SiteLogo, setSiteLogo] = useState('');
    const [SiteServices, setSiteServices] = useState([]);
    const [SiteProjects, setSiteProjects] = useState([]);

    const [saving, setSaving] = useState(false);
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    const cleanString = (str) => {
        return str.replace(/(\r\n|\n|\r)/gm, "")
    }

    // load site data from url
    useEffect(() => {
        if (siteID !== undefined) {
            loadSite()
        } else {
            window.location.href = '/dashboard'
        }
    }, [siteID]);

    const loadSite = () => {
        base.getSiteByID(siteID)
                .then(response => {
                    setSite(response)
                    let siteFields = response.fields
                    setOwnerName(siteFields.OwnerName)
                    setSiteName(siteFields.Name)
                    setSiteCTA(siteFields.SiteCTA)
                    setSiteCTAType(siteFields.SiteCTAType)
                    setSiteCTALink(siteFields.SiteCTALink)
                    setSiteCTAHeading(siteFields.SiteCTAHeading)
                    setSiteColor(siteFields.SiteColor)
                    setSiteHeroHeading(cleanString(siteFields.SiteHeroHeading))
                    setSiteHeroSubheading(cleanString(siteFields.SiteHeroSubheading))
                    setSiteRecordID(siteFields.SiteRecordID)
                    setSiteImages(siteFields.SiteImages)
                    setSiteLogo(siteFields.SiteLogo)
                    setSiteServices(siteFields.SiteServices ? JSON.parse(siteFields.SiteServices): [])
                    setSiteProjects(siteFields.SiteProjects ? JSON.parse(siteFields.SiteProjects): [])

                    setLastUpdated(siteFields.Updated)
                })
    }

    const saveSiteChanges = () => {
        base.updateSiteByID(siteID, {
            "Name": SiteName,
            "SiteCTA": SiteCTA,
            "SiteCTAHeading": SiteCTAHeading,
            "SiteCTALink": SiteCTALink,
            "SiteCTAType": SiteCTAType,
            "SiteColor": SiteColor,
            "SiteHeroHeading": SiteHeroHeading,
            "SiteHeroSubheading": SiteHeroSubheading,
            "SiteImages": SiteImages,
            "SiteLogo": SiteLogo,
            "SiteServices": SiteServices ? JSON.stringify(SiteServices): [],
            "SiteProjects": SiteProjects ? JSON.stringify(SiteProjects): []
        })
        .then (response => {
            loadSite()
        })
    }

    return (
        <div>
            { site.fields && <>
                <DashboardLayout
                    Title={`Edit ${site.fields.Name}`}
                    cta1={
                        <Button
                            type="button"
                            variant="solid"
                            target= "_blank"
                            href= {`/view/${siteID}`}
                            color= "indigo"
                        >
                            <span>View</span>
                        </Button>
                    }
                    cta2={
                        <div className='flex items-center gap-4'>
                            <p className='text-green-400'>
                                Saved
                                {
                                    new Date(lastUpdated).getDate === new Date().getDate ?
                                    ' today' :
                                    ` ${ new Date(lastUpdated).toLocaleString('en-US', { year:"numeric", month:"numeric", day:"numeric" }) }`
                                }
                                , { new Date(lastUpdated).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) }
                            </p>
                            <Button
                                type="button"
                                variant="solid"
                                color= { saving ? "green" : "slate" }
                                className={ unsavedChanges ? '  ' : ' hidden '}
                                onClick={e => {
                                    setSaving(true)
                                    saveSiteChanges()
                                    setTimeout(() => {
                                        setSaving(false)
                                        setUnsavedChanges(false);
                                    }, 2000)
                                }}
                            >
                                <span>
                                    {
                                        saving ? <div className='flex items-center gap-2'>
                                            Saving...
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                            </svg>
                                        </div>
                                        :
                                        <> Save <span aria-hidden="true">&uarr;</span> </>
                                    }
                                </span>
                            </Button>
                        </div>
                    }
                    hideNav={true}
                    Content={
                    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
                        <div className="grid grid-cols-1 gap-4">
                            <section>
                                <div className="overflow-hidden rounded-lg bg-white shadow">
                                    <div className="p-6">
                                        <SiteEditor
                                            unsavedChanges={unsavedChanges} setUnsavedChanges={setUnsavedChanges}
                                            OwnerName={OwnerName} setOwnerName={setOwnerName}
                                            SiteName={SiteName} setSiteName={setSiteName}
                                            SiteCTA={SiteCTA} setSiteCTA={setSiteCTA}
                                            SiteProjects={SiteProjects} setSiteProjects={setSiteProjects}
                                            SiteCTALink={SiteCTALink} setSiteCTALink={setSiteCTALink}
                                            SiteCTAType={SiteCTAType} setSiteCTAType={setSiteCTAType}
                                            SiteCTAHeading={SiteCTAHeading} setSiteCTAHeading={setSiteCTAHeading}
                                            SiteColor={SiteColor} setSiteColor={setSiteColor}
                                            SiteHeroHeading={SiteHeroHeading} setSiteHeroHeading={setSiteHeroHeading}
                                            SiteHeroSubheading={SiteHeroSubheading} setSiteHeroSubheading={setSiteHeroSubheading}
                                            SiteServices={SiteServices} setSiteServices={setSiteServices}
                                            SiteRecordID={SiteRecordID} siteRecordID={setSiteRecordID}
                                            SiteImages={SiteImages} setSiteImages={setSiteImages}
                                            SiteLogo={SiteLogo} setSiteLogo={setSiteLogo}
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                            <section aria-labelledby="section-1-title">
                                <h2 className="sr-only" id="section-1-title">Site Preview</h2>
                                <div className="overflow-hidden rounded-lg bg-white shadow">
                                    <div className="p-6">
                                        <div className="border-4 border-slate-800 rounded-lg shadow-xl">
                                            <SiteDisplay
                                                OwnerName={OwnerName}
                                                SiteName={SiteName}
                                                SiteCTA={SiteCTA}
                                                SiteCTALink={(SiteCTAType === "website" ? "https://" : "mailto:")  + SiteCTALink}
                                                SiteCTAHeading={SiteCTAHeading}
                                                SiteColor={SiteColor}
                                                SiteHeroHeading={SiteHeroHeading}
                                                SiteHeroSubheading={SiteHeroSubheading}
                                                SiteRecordID={SiteRecordID}
                                                SiteImages={SiteImages}
                                                SiteLogo={SiteLogo}
                                                SiteServices={SiteServices}
                                                SiteProjects={SiteProjects}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                } />
            </> }
        </div>
    )
}

export default SiteBuilder;